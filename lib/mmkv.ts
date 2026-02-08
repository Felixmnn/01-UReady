// Version-agnostic MMKV adapter that works with v3 and v4, with a
// safe fallback to AsyncStorage when Nitro/MMKV isn't registered.

import AsyncStorage from '@react-native-async-storage/async-storage';

let storageInstance: any | null = null;
let useFallback = false;
const memory = new Map<string, string | number | boolean>();
let hydrated = false;

async function hydrateFromAsyncStorage() {
	if (hydrated) return;
	try {
		const keys = await AsyncStorage.getAllKeys();
		if (keys && keys.length > 0) {
			const entries = await AsyncStorage.multiGet(keys);
			for (const [key, value] of entries) {
				if (value == null) continue;
				try {
					// Try to parse as JSON number/boolean/string; fall back to raw string
					const parsed = JSON.parse(value);
					memory.set(key, parsed);
				} catch {
					memory.set(key, value);
				}
			}
		}
	} catch {
		// ignore hydration errors
	} finally {
		hydrated = true;
	}
}

function tryInitMMKV() {
	if (storageInstance || useFallback) return;
	try {
		const mmkv: any = require('react-native-mmkv');
		if (typeof mmkv.createMMKV === 'function') {
			// MMKV v4
			storageInstance = mmkv.createMMKV();
		} else if (typeof mmkv.MMKV === 'function') {
			// MMKV v3
			storageInstance = new mmkv.MMKV();
		} else {
			throw new Error('Unsupported react-native-mmkv version: no createMMKV or MMKV found');
		}
	} catch (e) {
		// MMKV not available or Nitro not registered; enable fallback and hydrate
		useFallback = true;
		hydrateFromAsyncStorage();
	}
}

function fallbackSet(key: string, value: string | number | boolean) {
	memory.set(key, value);
	try {
		AsyncStorage.setItem(key, JSON.stringify(value));
	} catch {}
}

function fallbackGetString(key: string): string | undefined {
	const v = memory.get(key);
	return typeof v === 'string' ? v : v !== undefined ? String(v) : undefined;
}

function fallbackGetNumber(key: string): number | undefined {
	const v = memory.get(key);
	if (typeof v === 'number') return v;
	if (typeof v === 'string') {
		const n = Number(v);
		return isNaN(n) ? undefined : n;
	}
	return undefined;
}

function fallbackGetBoolean(key: string): boolean | undefined {
	const v = memory.get(key);
	if (typeof v === 'boolean') return v;
	if (typeof v === 'string') {
		if (v === 'true') return true;
		if (v === 'false') return false;
	}
	return undefined;
}

function fallbackRemove(key: string) {
	memory.delete(key);
	try {
		AsyncStorage.removeItem(key);
	} catch {}
}

function fallbackClearAll() {
	memory.clear();
	try {
		AsyncStorage.clear();
	} catch {}
}

export const storage = {
	set: (key: string, value: string | number | boolean) => {
		tryInitMMKV();
		if (!useFallback && storageInstance) {
			storageInstance.set(key, value);
		} else {
			fallbackSet(key, value);
		}
	},
	getString: (key: string): string | undefined => {
		tryInitMMKV();
		if (!useFallback && storageInstance) {
			return storageInstance.getString(key);
		}
		return fallbackGetString(key);
	},
	getNumber: (key: string): number | undefined => {
		tryInitMMKV();
		if (!useFallback && storageInstance) {
			return storageInstance.getNumber(key);
		}
		return fallbackGetNumber(key);
	},
	getBoolean: (key: string): boolean | undefined => {
		tryInitMMKV();
		if (!useFallback && storageInstance) {
			return storageInstance.getBoolean(key);
		}
		return fallbackGetBoolean(key);
	},
	contains: (key: string): boolean => {
		tryInitMMKV();
		if (!useFallback && storageInstance) {
			if (typeof storageInstance.contains === 'function') {
				return storageInstance.contains(key);
			}
			return (
				storageInstance.getString(key) !== undefined ||
				storageInstance.getNumber(key) !== undefined ||
				storageInstance.getBoolean(key) !== undefined
			);
		}
		return memory.has(key);
	},
	delete: (key: string) => {
		tryInitMMKV();
		if (!useFallback && storageInstance) {
			if (typeof storageInstance.delete === 'function') {
				storageInstance.delete(key);
			} else if (typeof storageInstance.remove === 'function') {
				storageInstance.remove(key);
			} else {
				// No delete/remove available; clear all is too destructive, so fallback
				fallbackRemove(key);
			}
		} else {
			fallbackRemove(key);
		}
	},
	remove: (key: string) => {
		(storage as any).delete(key);
	},
	clearAll: () => {
		tryInitMMKV();
		if (!useFallback && storageInstance) {
			storageInstance.clearAll();
		} else {
			fallbackClearAll();
		}
	},
	getAllKeys: (): string[] => {
		tryInitMMKV();
		if (!useFallback && storageInstance && typeof storageInstance.getAllKeys === 'function') {
			return storageInstance.getAllKeys();
		}
		return Array.from(memory.keys());
	},
	// Optional: allow manual hydration when fallback is active
	hydrateAsync: async () => {
		useFallback = true;
		await hydrateFromAsyncStorage();
	},
};