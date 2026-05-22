import { Models } from "react-native-appwrite";
import { databases,config } from './../appwrite';
import { storage } from "../mmkv";

export type PublicEducationCategory =
    | "UNIVERSITY"
    | "SCHOOL"
    | "EDUCATION"
    | "OTHER";

type PublicProfileCacheStatus = "public" | "hidden" | "notFound";

type PublicProfileCacheEntry = {
    status: PublicProfileCacheStatus;
    name: string | null;
    isPublic: boolean;
    updatedAt: number;
    profile: AppwritePublicProfile | null;
};

export type PublicProfileLookupResult =
    | { status: "public"; profile: AppwritePublicProfile; fromCache: boolean }
    | { status: "hidden" | "notFound"; fromCache: boolean };

export type PublicProfileCacheSnapshot = {
    status: PublicProfileCacheStatus;
    name: string | null;
    isPublic: boolean;
    updatedAt: number;
    isFresh: boolean;
};

const PUBLIC_PROFILE_CACHE_PREFIX = "public.profile.byId.";
const PUBLIC_PROFILE_PUBLIC_TTL_MS = 15 * 60 * 1000;
const PUBLIC_PROFILE_NEGATIVE_TTL_MS = 5 * 60 * 1000;
const publicProfileInFlight = new Map<string, Promise<PublicProfileLookupResult>>();
const publicProfileCacheListeners = new Map<
    string,
    Set<(snapshot: PublicProfileCacheSnapshot) => void>
>();

type CreatePublicProfileParams = {
    id: string,
    name: string,
    educationKategory?: PublicEducationCategory | string | null;
    educationKathegory?: PublicEducationCategory | string | null;
};

const hasErrorCode = (error: unknown): error is { code: number } =>
    typeof error === "object" && error !== null && "code" in error;

const getPublicProfileCacheKey = (userId: string) =>
    `${PUBLIC_PROFILE_CACHE_PREFIX}${userId}`;

const getCacheTtl = (status: PublicProfileCacheStatus) =>
    status === "public"
        ? PUBLIC_PROFILE_PUBLIC_TTL_MS
        : PUBLIC_PROFILE_NEGATIVE_TTL_MS;

const isCacheFresh = (entry: PublicProfileCacheEntry) =>
    Date.now() - entry.updatedAt < getCacheTtl(entry.status);

const toCacheSnapshot = (
    entry: PublicProfileCacheEntry
): PublicProfileCacheSnapshot => ({
    status: entry.status,
    name: entry.name,
    isPublic: entry.isPublic,
    updatedAt: entry.updatedAt,
    isFresh: isCacheFresh(entry),
});

const readPublicProfileCache = (userId: string): PublicProfileCacheEntry | null => {
    const raw = storage.getString(getPublicProfileCacheKey(userId));
    if (!raw) return null;

    try {
        return JSON.parse(raw) as PublicProfileCacheEntry;
    } catch (error) {
        console.error("Error parsing public profile cache:", error);
        return null;
    }
};

const writePublicProfileCache = (userId: string, entry: PublicProfileCacheEntry) => {
    storage.set(getPublicProfileCacheKey(userId), JSON.stringify(entry));

    const listeners = publicProfileCacheListeners.get(userId);
    if (!listeners || listeners.size === 0) return;

    const snapshot = toCacheSnapshot(entry);
    listeners.forEach((listener) => listener(snapshot));
};

const toLookupResult = (
    entry: PublicProfileCacheEntry,
    fromCache: boolean
): PublicProfileLookupResult => {
    if (entry.status === "public" && entry.profile) {
        return {
            status: "public",
            profile: entry.profile,
            fromCache,
        };
    }

    return {
        status: entry.status === "public" ? "notFound" : entry.status,
        fromCache,
    };
};

const getEducationCategoryValue = (params: {
    educationKategory?: PublicEducationCategory | string | null;
    educationKathegory?: PublicEducationCategory | string | null;
}): PublicEducationCategory | null => {
    const category = params.educationKategory ?? params.educationKathegory ?? null;

    if (
        category === "UNIVERSITY" ||
        category === "SCHOOL" ||
        category === "EDUCATION" ||
        category === "OTHER"
    ) {
        return category;
    }

    return category ? "OTHER" : null;
};

export interface AppwritePublicProfile extends Models.Document {
    avatar: string,
    isPublic: boolean,
    name: string,
    modules: string[],
    bio:string | null,
    educationKategory: PublicEducationCategory | null;
    badges: string[];
}

export  async function createEmptyPublicProfile({
    id,
    name,
    educationKategory,
    educationKathegory,
}: CreatePublicProfileParams): Promise<AppwritePublicProfile | null> {
    const normalizedEducationCategory = getEducationCategoryValue({
        educationKategory,
        educationKathegory,
    });
    try {
        const promise = await databases.createDocument<AppwritePublicProfile>(
            config.databaseId,
            config.publicprofile,
            id,
            {
                avatar: "",
                isPublic: false,
                name: name,
                modules: [],
                bio: null,
                educationKategory: normalizedEducationCategory,
                badges: []
            }
        );
        return promise;

    } catch (error) {        
        console.error("Error creating public profile:", error);
        return null;
    }
}

export async function updatePublicProfile(profile: AppwritePublicProfile): Promise<AppwritePublicProfile | null> {
    try {
        const updatedProfile = await databases.updateDocument<AppwritePublicProfile>(   
            config.databaseId,
            config.publicprofile,
            profile.$id,
            {
                avatar: profile.avatar,
                isPublic: profile.isPublic,
                name: profile.name,
                modules: profile.modules,
                bio: profile.bio,
                educationKategory: profile.educationKategory,
                badges: profile.badges
            }
        );
        savePublicProfileToMMKV(updatedProfile);
        return updatedProfile;
    }
        catch (error) {
        console.error("Error updating public profile:", error);
        return null;
    }
}

export async function getPublicProfile(
    userId: string,
    fallbackData?: Omit<CreatePublicProfileParams, "id">
): Promise<AppwritePublicProfile | null> {
    try {
        const profile = await databases.getDocument<AppwritePublicProfile>(
            config.databaseId,
            config.publicprofile,
            userId
        );
        savePublicProfileToMMKV(profile); 
        return profile;
    }
        catch (error) {
        if (hasErrorCode(error) && error.code === 404 && fallbackData?.name) {
            const createdProfile = await createEmptyPublicProfile({
                id: userId,
                name: fallbackData.name,
                educationKategory: getEducationCategoryValue(fallbackData),
            });
            if (createdProfile) {
                savePublicProfileToMMKV(createdProfile); 
                return createdProfile;
            }
        }
        console.error("Error fetching public profile:", error);
        return getPublicProfileFromMMKV();
    }
}

export async function deletePublicProfile(userId: string): Promise<void> {
    try {
        await databases.deleteDocument(
            config.databaseId,
            config.publicprofile,
            userId
        );
        clearPublicProfileFromMMKV();
    } catch (error) {
        console.error("Error deleting public profile:", error);
    }
}


export function savePublicProfileToMMKV(profile: AppwritePublicProfile) {
    const profileString = JSON.stringify(profile);
    storage.set('user.profile', profileString);
}

export function getPublicProfileFromMMKV(): AppwritePublicProfile | null {
    const profileString = storage.getString('user.profile');
    if (profileString) {
        try {
            return JSON.parse(profileString) as AppwritePublicProfile;
        } catch (error) {
            console.error("Error parsing public profile from storage:", error);
            return null;
        }
    }
    return null;
}

export function clearPublicProfileFromMMKV() {
    storage.delete('user.profile');
}


export function getCachedPublicProfileNameByID(userId: string): string | null {
    const cached = readPublicProfileCache(userId);
    if (!cached || !isCacheFresh(cached)) return null;
    if (cached.status !== "public" || !cached.isPublic) return null;
    return cached.name || null;
}

export function subscribePublicProfileCacheByID(
    userId: string,
    listener: (snapshot: PublicProfileCacheSnapshot) => void
): () => void {
    const listeners = publicProfileCacheListeners.get(userId) ?? new Set();
    listeners.add(listener);
    publicProfileCacheListeners.set(userId, listeners);

    const cached = readPublicProfileCache(userId);
    if (cached) {
        listener(toCacheSnapshot(cached));
    }

    return () => {
        const current = publicProfileCacheListeners.get(userId);
        if (!current) return;
        current.delete(listener);
        if (current.size === 0) {
            publicProfileCacheListeners.delete(userId);
        }
    };
}


export async function getPublicProfileByID(
    userId: string
): Promise<PublicProfileLookupResult> {
    const cached = readPublicProfileCache(userId);
    if (cached && isCacheFresh(cached)) {
        return toLookupResult(cached, true);
    }

    const inFlight = publicProfileInFlight.get(userId);
    if (inFlight) {
        return inFlight;
    }

    const request = (async (): Promise<PublicProfileLookupResult> => {
        try {
            const profile = await databases.getDocument<AppwritePublicProfile>(
                config.databaseId,
                config.publicprofile,
                userId
            );

            if (!profile.isPublic) {
                writePublicProfileCache(userId, {
                    status: "hidden",
                    name: null,
                    isPublic: false,
                    updatedAt: Date.now(),
                    profile: null,
                });

                return { status: "hidden", fromCache: false };
            }

            writePublicProfileCache(userId, {
                status: "public",
                name: profile.name || null,
                isPublic: true,
                updatedAt: Date.now(),
                profile,
            });

            return { status: "public", profile, fromCache: false };
        } catch (error) {
            if (hasErrorCode(error) && error.code === 404) {
                writePublicProfileCache(userId, {
                    status: "notFound",
                    name: null,
                    isPublic: false,
                    updatedAt: Date.now(),
                    profile: null,
                });

                return { status: "notFound", fromCache: false };
            }

            console.error("Error fetching public profile by ID:", error);

            if (cached) {
                return toLookupResult(cached, true);
            }

            return { status: "notFound", fromCache: true };
        } finally {
            publicProfileInFlight.delete(userId);
        }
    })();

    publicProfileInFlight.set(userId, request);
    return request;
}
