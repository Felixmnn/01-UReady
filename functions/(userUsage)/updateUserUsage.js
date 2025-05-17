const boostTypes = {
    "SUPERCHARGE": {
        "duration": 30,
    },
}



/**
 * This function checks if the user usage is up to date.
 * - first it checks if the energy need to be updated
 * - then it checks if the streak is still active
 * - then it checks if the boost is still active
 */
export async function updateUserUsage(userUsage) {
    let newUserUsage = userUsage;
    const now = new Date();
    userUsage.streakLastUpdate = new Date(userUsage.streakLastUpdate);
    userUsage.boostActivation = userUsage.boostActivation ? new Date(userUsage.boostActivation) : null;

    console.log("Updating user usage...", userUsage);
    if (userUsage.energy < 10) {
        const div = differenceInHours(userUsage.streakLastUpdate, now);
        console.log("Updating energy...", now, userUsage.streakLastUpdate,div);

        if (div > 1) {
            newUserUsage.energy += Math.floor(div / 1);
            if (newUserUsage.energy > 10) {
                newUserUsage.energy = 10;
            }
        }
    }
    if (userUsage.streakActive) {
        const div = differenceInHours(userUsage.streakLastUpdate, now);
        if (div > 24) {
            newUserUsage.streakActive = false;
            newUserUsage.streak = 0;
            newUserUsage.streakLastUpdate = now;
        }
    }
    if (userUsage.boostActive) {
        const div = differenceInHours(userUsage.boostActivation, now);
        if (userUsage.boostType === null) {
            newUserUsage.boostActive = false;
            newUserUsage.boostType = null;
            newUserUsage.boostActivation = null;
        } else {
        const boostDuration = boostTypes[userUsage.boostType].duration;
        if (div > boostDuration) {
            newUserUsage.boostActive = false;
            newUserUsage.boostType = null;
            newUserUsage.boostActivation = null;
        }
    }
    } 
    console.log("User usage updated", newUserUsage);

    return newUserUsage;
}


export function differenceInHours(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return Math.floor(diffInMs / (1000 * 60 * 60));
}  



