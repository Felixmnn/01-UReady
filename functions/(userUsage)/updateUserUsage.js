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

    if (userUsage.energy < 10) {
        const div = differenceInHours(userUsage.streakLastUpdate, now);

        if (div > 1) {
            newUserUsage.energy += Math.floor(div / 1);
            if (newUserUsage.energy > 10) {
                newUserUsage.energy = 10;
            }
            newUserUsage.streakLastUpdate = now;
        }
    }
    if (userUsage.streakUpdate.length > 0) {
        const lastDay = userUsage.streakUpdate[0];
        if (wasYesterday(lastDay)) {
            if (userUsage.streakActive) {
                newUserUsage.streakUpdate = [now.toISOString(), ...userUsage.streakUpdate];
                newUserUsage.streak += 1;
            } else {
                newUserUsage.streakActive = true;
                newUserUsage.streak = 1;
                newUserUsage.streakUpdate = [now.toISOString(), ...userUsage.streakUpdate];
            }
        } else if (isToday(lastDay)) {
        } else {
            newUserUsage.streakActive = false;
            newUserUsage.streak = 0;
            newUserUsage.streakUpdate = [now.toISOString(),...userUsage.streakUpdate];
        }
    } else {
        newUserUsage.streakActive = false;
        newUserUsage.streak = 0;
        newUserUsage.streakUpdate = [now.toISOString(),...userUsage.streakUpdate];
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

function wasYesterday(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
    console.log("Compare Date Result", compare.getTime() === yesterday.getTime());
  return compare.getTime() === yesterday.getTime();
}

function isToday(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  
  return compare.getTime() === today.getTime();
}
