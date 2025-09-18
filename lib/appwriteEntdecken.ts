import { Query } from "appwrite";
import { databases, config } from "./appwrite";

export async function getMatchingModules(
    {
        
        eductaionType,

        universityDegreeType,
        universityKategorie,

        schoolType,
        schoolSubjects,
        schoolGrades,

        eductaionCategory,
        educationSubject,

        otherSubjects

    }:{
        eductaionType: "UNIVERSITY" | "SCHOOL" | "EDUCATION" | "OTHER" | null,
        universityDegreeType: "BACHELOR" | "MASTER" | "PHD" | "DIPLOM" | "STATE_EXAM" | "OTHER" | null ,
        universityKategorie: string[] | undefined | null

        schoolType?: string[] | undefined | null, // e.g. ["gymnasium", "realschule"]
        schoolSubjects?: string[] | undefined | null, // e.g. ["mathematik", "deutsch"]
        schoolGrades?: number[] | undefined | null, // e.g. [1,2,3,4,5,6,7,8,9,10,11,12,13]

        eductaionCategory?: string[] | undefined | null,
        educationSubject?: string[] | undefined | null,

        otherSubjects?: string[] | undefined | null,
    }
) {
    console.log("getMatchingModules called with:")
    switch (eductaionType) {
        case "UNIVERSITY":
            console.log("UNIVERSITY")
            return await getUniversityModules({universityDegreeType, universityKategorie});
        case "SCHOOL":
            console.log("SCHOOL")
            return await getSchoolModules({schoolType, schoolSubjects, schoolGrades});
        case "EDUCATION":
            return await getEducationModules({eductaionCategory, educationSubject});
            console.log("EDU")
        case "OTHER":
            return await getOtherModules({schoolSubjects});
            }
}

/* Function for University Modules 
    - Degree Type   | a Module can only have one Degree Type
    - Categories    | a Module can have multiple Categories
*/
async function getUniversityModules({
  universityDegreeType,
  universityKategorie,
}: {
  universityDegreeType?:
    | "BACHELOR"
    | "MASTER"
    | "PHD"
    | "DIPLOM"
    | "STATE_EXAM"
    | "OTHER"
    | "NONE";
  universityKategorie?: string[] | null;
}) {

  const filters = [
    Query.equal("kategoryType", "UNIVERSITY"),
    Query.equal("public", true),
  ];

  // Nur hinzufügen, wenn DegreeType übergeben wurde
  if (universityDegreeType) {
    filters.push(Query.contains("creationUniversityProfession", universityDegreeType));
  }

  if (universityKategorie && universityKategorie.length > 0) {
    // Falls mehrere Subjects: OR-Verknüpfung
    const uKat =
      universityKategorie.length > 1
        ? universityKategorie
        : [universityKategorie[0], universityKategorie[0]];

    const subjectFilters = uKat.map((kat) =>
      Query.contains("creationSubject", kat)
    );
    filters.push(Query.or(subjectFilters));
  }

  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.moduleCollectionId,
      [
        Query.and(filters),
        Query.limit(5)
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching university modules:", error);
    return [];
  }
}



async function getSchoolModules({
  schoolType,
  schoolSubjects,
  schoolGrades,
}: {
  schoolType?: string[] | undefined | null, // e.g. ["gymnasium", "realschule"]
  schoolSubjects?: string[] | undefined | null, // e.g. ["mathematik", "deutsch"]
  schoolGrades?: number[] | undefined | null, // e.g. [1,2,3,4,5,6,7,8,9,10,11,12,13]
}) {
  const filters = [
    Query.equal("kategoryType", "SCHOOL"),
    Query.equal("public", true),
  ];

  if (schoolType && schoolType.length > 0) {
    // Falls mehrere Subjects: OR-Verknüpfung
    let sType = schoolType.length > 1 ? schoolType: [schoolType[0], schoolType[0]]
    const typeFilters = sType.map((type) =>
      Query.contains("creationSchoolForm", type.toUpperCase())
    );
    filters.push(Query.or(typeFilters));
  }
  if (schoolSubjects && schoolSubjects.length > 0) {
    // Falls mehrere Subjects: OR-Verknüpfung
    let sSub = schoolSubjects.length > 1 ? schoolSubjects: [schoolSubjects[0], schoolSubjects[0]]
    const subjectFilters = sSub.map((sub) =>
      Query.contains("creationSubject", sub)
    );
    filters.push(Query.or(subjectFilters));
  }
  if (schoolGrades && schoolGrades.length > 0) {
    // Falls mehrere Subjects: OR-Verknüpfung
    let sGrade = schoolGrades.length > 1 ? schoolGrades: [schoolGrades[0], schoolGrades[0]]
    const gradeFilters = sGrade.map((grade) =>
      Query.equal("creationKlassNumber", grade)
    );
    filters.push(Query.or(gradeFilters));
  }
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.moduleCollectionId,
      [Query.and(filters)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching school modules:", error);
    return [];
  }}


async function getOtherModules({
  schoolSubjects,
}: {
  schoolSubjects?: string[] | undefined | null,
}) {
  console.log("Starting");  
  const filters = [
    Query.notEqual("kategoryType", "UNIVERSITY"), // Ausschließen von University Modulen
    Query.notEqual("kategoryType", "EDUCATION"), // Ausschließen von Education Modulen
    Query.notEqual("kategoryType", "OTHER"), // Ausschließen von Other Modulen
    Query.equal("public", true),
  ];
  if (schoolSubjects && schoolSubjects.length > 0) {
    // Falls mehrere Subjects: OR-Verknüpfung
    let oSub = schoolSubjects.length > 1 ? schoolSubjects: [schoolSubjects[0], schoolSubjects[0]]
    const subjectFilters = oSub.map((sub) =>
      Query.contains("creationSubject", sub)
    );
    filters.push(Query.or(subjectFilters));
  }
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.moduleCollectionId,
      [Query.and(filters)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching other modules:", error);
    return [];
  }
}

async function getEducationModules({
  eductaionCategory,
  educationSubject,
}: {
  eductaionCategory?: string[] | undefined | null,
  educationSubject?: string[] | undefined | null, 
}) {  
  const filters = [
    Query.equal("kategoryType", "EDUCATION"),
    Query.equal("public", true),
  ];
  if (eductaionCategory && eductaionCategory.length > 0) {  
    // Falls mehrere Subjects: OR-Verknüpfung
    let eKat = eductaionCategory.length > 1 ? eductaionCategory: [eductaionCategory[0], eductaionCategory[0]]
    const categoryFilters = eKat.map((kat) =>
      Query.contains("creationEducationKathegory", kat)
    );
    console.log("💡Category Filters:", categoryFilters);
    filters.push(Query.or(categoryFilters));
  }   
  if (educationSubject && educationSubject.length > 0) {  
    // Falls mehrere Subjects: OR-Verknüpfung
    let eSub = educationSubject.length > 1 ? educationSubject: [educationSubject[0], educationSubject[0]]
    const subjectFilters = eSub.map((sub) =>
      Query.contains("creationEducationSubject", sub)
    );
    filters.push(Query.or(subjectFilters));
  }
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.moduleCollectionId,
      [Query.and(filters)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching education modules:", error);
    return [];
  }
}