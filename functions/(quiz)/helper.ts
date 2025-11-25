//This can become usefull in the browser
export async function tryBack(router: any) {
  try {
    router.back();
  } catch (error) {
    if (__DEV__) {
      console.log(error);
    }
    router.push("/bibliothek");

  }
}

//Funtion Randomize Array
export function randomizeArray(array: any[]) {
  const shuffled = [...array]; // Kopie der Liste
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function maybeParseJSON(value: string) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return {
      title: value,
      latex: "",
      image: "",
    };
  }
}
