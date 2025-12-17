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


/**
 * Last Question List refresh Timestamp
 */
export function setMMKVLastQuestionListRefreshTimestamp(moduleId: string){
    const timestamp = Date.now();
    storage.set(`lastQuestionListRefresh_${moduleId}`, timestamp);
}

/**
 * Get Last Question List refresh Timestamp
 */
export function getMMKVLastQuestionListRefreshTimestamp(moduleId: string): number | null {
    const timestamp = storage.getNumber(`lastQuestionListRefresh_${moduleId}`);
    return timestamp !== undefined ? timestamp : null;
}

/**
    * Prüft, ob der gespeicherte Timestamp älter als 1 Stunde ist
    * Gibt true zurück, wenn der Timestamp abgelaufen ist oder nicht vorhanden ist
    */ 
export function checkMMKVQuestionListRefreshTimestampExpiry(moduleId: string): boolean {
    const timestamp = getMMKVLastQuestionListRefreshTimestamp(moduleId);
    if (timestamp === null) {
        return true; // Kein Timestamp vorhanden, also als abgelaufen betrachten
    }
    else {
        const currentTime = Date.now();
        const elapsedTime = currentTime - timestamp;
        const oneHourInMs = 1 * 60 * 60 * 1000;
        return elapsedTime > oneHourInMs;
    }
}


/**
 * Last Note/Document List refresh Timestamp
 */
export function setMMKVLastNoteDocumentListRefreshTimestamp(sessionId: string){
    const timestamp = Date.now();
    storage.set(`lastNoteDocumentListRefresh_${sessionId}`, timestamp);
}

/**
 * Get Last Note/Document List refresh Timestamp
 */
export function getMMKVLastNoteDocumentListRefreshTimestamp(sessionId: string): number | null {
    const timestamp = storage.getNumber(`lastNoteDocumentListRefresh_${sessionId}`);
    return timestamp !== undefined ? timestamp : null;
}

/**
 * Prüft, ob der gespeicherte Timestamp älter als 1 Stunde ist
 * Gibt true zurück, wenn der Timestamp abgelaufen ist oder nicht vorhanden ist
 */
export function checkMMKVNoteDocumentListRefreshTimestampExpiry(sessionId: string): boolean {
    const timestamp = getMMKVLastNoteDocumentListRefreshTimestamp(sessionId);
    if (timestamp === null) {
        return true; // Kein Timestamp vorhanden, also als abgelaufen betrachten
    }
    else {
        const currentTime = Date.now();
        const elapsedTime = currentTime - timestamp;
        const oneHourInMs = 1 * 60 * 60 * 1000;
        return elapsedTime > oneHourInMs;
    }
}