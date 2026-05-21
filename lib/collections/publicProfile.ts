import { Models } from "react-native-appwrite";
import { databases,config } from './../appwrite';
import { storage } from "../mmkv";

type CreatePublicProfileParams = {
    id: string,
    name: string,
    educationKategory?: string | null;
    educationKathegory?: string | null;
};

const hasErrorCode = (error: unknown): error is { code: number } =>
    typeof error === "object" && error !== null && "code" in error;

const getEducationCategoryValue = (params: {
    educationKategory?: string | null;
    educationKathegory?: string | null;
}) => params.educationKategory ?? params.educationKathegory ?? null;

export interface AppwritePublicProfile extends Models.Document {
    avatar: string,
    isPublic: boolean,
    name: string,
    modules: string[],
    bio:string | null,
    educationKategory: string | null;
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

