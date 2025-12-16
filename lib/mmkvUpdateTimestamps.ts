import { storage } from "./mmkv";

export function setMMKVSessionTimestamp() {
    const timestamp = Date.now();
    storage.set("sessionTimestamp", timestamp);
}

export function getMMKVSessionTimestamp(): number | null {
    const timestamp = storage.getNumber("sessionTimestamp");
    return timestamp !== undefined ? timestamp : null;
}

/**
 * Prüft, ob der gespeicherte Timestamp älter als 24 Stunden ist
 * Gibt true zurück, wenn der Timestamp abgelaufen ist oder nicht vorhanden ist
 */ 
export function checkMMKVTimestampExpiry(): boolean {
    const timestamp = getMMKVSessionTimestamp();
    if (timestamp === null) {
        return true; // Kein Timestamp vorhanden, also als abgelaufen betrachten
    } else {
        const currentTime = Date.now();
        const elapsedTime = currentTime - timestamp;
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
        return elapsedTime > twentyFourHoursInMs;
    }
}