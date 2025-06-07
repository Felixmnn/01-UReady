import { Query } from "appwrite";
import { databases, config } from "./appwrite";


/**
 * 
 * @param {*} query // List of query paramters of Type Object key: value 
 * If value is an array, it will be treated as an OR condition for that key.
 */
export async function searchDocuments(query) {
    const queryParts = [];

    for (const key in query) {
        const value = query[key];

        if (Array.isArray(value)) {
            if (value.length === 1) {
                queryParts.push(Query.contains(key, value[0]));
            } else if (value.length > 1) {
                const subQueries = value.map(item => Query.contains(key, item));
                queryParts.push(Query.or(subQueries));
            }
        } else {
            queryParts.push(Query.equal(key, value));
        }
    }
    console.log("Query Parts:", queryParts);
    const response = await databases.listDocuments(
            config.databaseId,
            config.moduleCollectionId,
            [
               Query.and(queryParts)
            ]
        );
    return response.documents;
}