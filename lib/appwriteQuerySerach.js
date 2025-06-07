import { Query } from "appwrite";
import { databases, config } from "./appwrite";


/**
 * Führt eine dynamische Suche in Appwrite durch, basierend auf den angegebenen Filtern.
 *
 * @param {Object} query - Ein Objekt mit Filtern für die Abfrage.
 *
 * **Erlaubte Schlüssel (Appwrite-Feldnamen):**
 * 
 * | Feldname                     | Appwrite-Typ     | Beschreibung / Verhalten                   |
 * |-----------------------------|------------------|---------------------------------------------|
 * | name                        | string           | `equal()`                                   |
 * | creationCountry            | string           | `equal()`                                   |
 * | creationUniversity         | string           | `equal()`                                   |
 * | creationUniversityProfession | string         | `equal()`                                   |
 * | creationRegion             | string           | `equal()`                                   |
 * | creationSchoolForm         | string           | `equal()`                                   |
 * | creationKlassNumber        | string           | `equal()`                                   |
 * | creationLanguage           | string           | `equal()`                                   |
 * | creationUniversitySubject  | **array**        | `contains()` oder `or(contains())`          |
 * | creationUniversityFaculty  | **array**        | `contains()` oder `or(contains())`          |
 * | studiengangKathegory       | **array**        | `contains()` oder `or(contains())`          |
 * | creationEducationKathegory | string           | `equal()`                                   |
 * | creationSubject            | **array**        | `contains()` oder `or(contains())`          |
 * | creationEducationSubject   | string           | `equal()`                                   |
 * | kategoryType               | string           | `equal()`                                   |
 *
 * - Wenn der übergebene Wert ein `string` ist → wird mit `equal()` gesucht.
 * - Wenn der Wert ein `string[]` ist:
 *    - Bei Appwrite-Array-Feldern wird `contains()` verwendet
 *    - Bei einfachen Feldern wird `equal()` mit `Query.or()` kombiniert
 *
 * **Beispiel:**
 * ```js
 * searchDocuments({
 *   creationUniversityFaculty: ["Psychologie", "Wirtschaft"], // array → contains
 *   creationCountry: "Deutschland",                           // string → equal
 *   kategoryType: ["UNIVERSITY", "SCHOOL"]                    // string[] → or(equal)
 * });
 * ```
 *
 * @returns {Promise<Object[]>} Liste der gefundenen Appwrite-Dokumente.
 */

export async function searchDocuments(query) {
  const constAtributeIsArray = {
    name: false,
    creationCountry: false,
    creationUniversity: false,
    creationUniversityProfession: false,
    creationRegion: false,
    creationSchoolForm: false,
    creationKlassNumber: false,
    creationLanguage: false,
    creationUniversitySubject: true,
    creationUniversityFaculty: true,
    studiengangKathegory: true,
    creationEducationKathegory: false,
    creationSubject: true,
    creationEducationSubject: false,
    kategoryType: false,
  };

  const queryParts = [];

  for (const key in query) {
    const value = query[key];
    const isArrayInAppwrite = constAtributeIsArray[key] || false;
    if (value === undefined || value === null) {
        continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 1) {
        // Nur ein Wert im Query-Array
        queryParts.push(
          isArrayInAppwrite
            ? Query.contains(key, value[0])
            : Query.equal(key, value[0])
        );
      } else if (value.length > 1) {
        // Mehrere Werte im Query-Array
        const subQueries = value.map((item) =>
          isArrayInAppwrite
            ? Query.contains(key, item)
            : Query.equal(key, item)
        );
        queryParts.push(Query.or(subQueries));
      }
    } else {
      // Einzelwert
      queryParts.push(
        isArrayInAppwrite
          ? Query.contains(key, value)
          : Query.equal(key, value)
      );
    }
  }

  console.log("Query Parts:", queryParts);

  const response = await databases.listDocuments(
    config.databaseId,
    config.moduleCollectionId,
    [Query.and(queryParts)]
  );

  return response.documents;
}

/**
 *  This function recieves a list of querys and reduces the querys until the first query is found.
 *  Requirement is a obect with atleas two atributes.
 *  @param {Object} query - Ein Objekt mit Filtern für die Abfrage.
 *  @returns {Promise<Object[]>} Liste der gefundenen Appwrite-Dokumente.
 */
export async function recommendationSearch (query){
    console.log("Recommendation Search Query:", query);
    const keys = Object.keys(query);
    let queryLength = keys.length;

    while (queryLength > 1) {
        const slicedKeys = keys.slice(0, queryLength);
        const slicedQuery = {};
        for (const key of slicedKeys) {
            slicedQuery[key] = query[key];
            }  

        const result = await searchDocuments(slicedQuery);
        if (result.length > 0) {
            return result; 
        }
        queryLength--; 
    }
    return []; 
}
