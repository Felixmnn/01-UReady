import { Query } from "appwrite";
import { databases, config } from "./appwrite";

export async function getMatchingModules({
  searchText = "",
  offset = 0,
  languages,
  eductaionType,

  universityDegreeType,
  universityKategorie,

  schoolType,
  schoolSubjects,
  schoolGrades,

  eductaionCategory,
  educationSubject,

  otherSubjects,
}: {
  searchText?: string;  
  offset?: number;
  languages?: string[] | null;
  eductaionType: "UNIVERSITY" | "SCHOOL" | "EDUCATION" | "OTHER" | null;
  universityDegreeType: string[] | null;
  universityKategorie: string[] | undefined | null;

  schoolType?: string[] | undefined | null; // e.g. ["gymnasium", "realschule"]
  schoolSubjects?: string[] | undefined | null; // e.g. ["mathematik", "deutsch"]
  schoolGrades?: number[] | undefined | null; // e.g. [1,2,3,4,5,6,7,8,9,10,11,12,13]

  eductaionCategory?: string[] | undefined | null;
  educationSubject?: string[] | undefined | null;

  otherSubjects?: string[] | undefined | null;
}) {
  console.log("Aufruf mit:", {
    searchText,
    offset,
    languages,
    eductaionType,
    universityDegreeType,
    universityKategorie,
    schoolType,
    schoolSubjects,
    schoolGrades,
    eductaionCategory,
    educationSubject,
    otherSubjects,
  }
  )
  switch (eductaionType) {
    case "UNIVERSITY":
      console.log("UNIVERSITY");
      return await getUniversityModules({
        universityDegreeType,
        universityKategorie,
        offset,
        languages,
        searchText,
      });
    case "SCHOOL":
      console.log("SCHOOL");
      return await getSchoolModules({
        schoolType,
        schoolSubjects,
        schoolGrades,
        offset,
        languages,
        searchText,
      });
    case "EDUCATION":
      return await getEducationModules({
        eductaionCategory,
        educationSubject,
        offset,
        languages,
        searchText,
      });
      console.log("EDU");
    case "OTHER":
      return await getOtherModules({ schoolSubjects, offset, languages });
  }
}

/* Function for University Modules 
    - Degree Type   | a Module can only have one Degree Type
    - Categories    | a Module can have multiple Categories
*/
async function getUniversityModules({
  universityDegreeType,
  universityKategorie,
  offset,
  languages,
  searchText,
}: {
  offset?: number;
  universityDegreeType?: string[] | null; // e.g. "BACHELOR", "MASTER", "PHD", "DIPLOM", "STATE_EXAM", "OTHER", "NONE"
  universityKategorie?: string[] | null;
  languages?: string[] | null;
  searchText?: string;
}) {
  console.log("Fetching University Modules with:", {
    universityDegreeType,
    universityKategorie,
    offset,
  });
  const filters = [
    Query.equal("kategoryType", "UNIVERSITY"),
    Query.equal("public", true),
  ];

  // Nur hinzufügen, wenn DegreeType übergeben wurde
  if (universityDegreeType) {
    filters.push(
      Query.contains("creationUniversityProfession", universityDegreeType)
    );
  }

  if (languages && languages.length === 1) {
    console.log("Singel Case")
    filters.push(Query.equal("creationLanguage", languages[0]));
  } else if (languages && languages.length > 1) {
    filters.push(Query.or(languages.map((lang) => Query.equal("creationLanguage", lang))));
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
  if (searchText && searchText.trim() !== "") {
    filters.push(Query.contains("name", searchText));
  }
  console.log("Filters for University Modules:", filters);
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.moduleCollectionId,
      [...filters,Query.limit(10), Query.offset(offset ?? 0)]
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
  offset,
  languages,
  searchText,
}: {
  schoolType?: string[] | undefined | null;
  schoolSubjects?: string[] | undefined | null;
  schoolGrades?: number[] | undefined | null;
  offset?: number;
  languages?: string[] | null;
  searchText?: string;
}) {
  const filters = [
    Query.equal("kategoryType", "SCHOOL"),
    Query.equal("public", true),
  ];

  if (languages && languages.length > 0) {
    filters.push(Query.equal("creationLanguage", languages));
  }

  if (schoolType && schoolType.length > 0) {
    let sType =
      schoolType.length > 1 ? schoolType : [schoolType[0], schoolType[0]];
    const typeFilters = sType.map((type) =>
      Query.contains("creationSchoolForm", type.toUpperCase())
    );
    filters.push(Query.or(typeFilters));
  }
  if (schoolSubjects && schoolSubjects.length > 0) {
    let sSub =
      schoolSubjects.length > 1
        ? schoolSubjects
        : [schoolSubjects[0], schoolSubjects[0]];
    const subjectFilters = sSub.map((sub) =>
      Query.contains("creationSubject", sub)
    );
    filters.push(Query.or(subjectFilters));
  }
  if (schoolGrades && schoolGrades.length > 0) {
    let sGrade =
      schoolGrades.length > 1
        ? schoolGrades
        : [schoolGrades[0], schoolGrades[0]];
    const gradeFilters = sGrade.map((grade) =>
      Query.equal("creationKlassNumber", grade)
    );
    filters.push(Query.or(gradeFilters));
  }
  if (searchText && searchText.trim() !== "") {
    filters.push(Query.contains("name", searchText));
  }
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.moduleCollectionId,
      [...filters, Query.limit(10), Query.offset(offset ?? 0)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching school modules:", error);
    return [];
  }
}

async function getOtherModules({
  schoolSubjects,
  offset,
  languages,
  searchText,
}: {
  schoolSubjects?: string[] | undefined | null;
  offset?: number;
  languages?: string[] | null;
  searchText?: string;
}) {
  console.log("Starting");
  const filters = [
    Query.notEqual("kategoryType", "UNIVERSITY"),
    Query.notEqual("kategoryType", "EDUCATION"),
    Query.notEqual("kategoryType", "OTHER"),
    Query.equal("public", true),
  ];
  if (languages && languages.length > 0) {
    filters.push(Query.equal("creationLanguage", languages));
  }
  if (schoolSubjects && schoolSubjects.length > 0) {
    let oSub =
      schoolSubjects.length > 1
        ? schoolSubjects
        : [schoolSubjects[0], schoolSubjects[0]];
    const subjectFilters = oSub.map((sub) =>
      Query.contains("creationSubject", sub)
    );
    filters.push(Query.or(subjectFilters));
  }
  if (searchText && searchText.trim() !== "") {
    filters.push(Query.contains("name", searchText));
  }
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.moduleCollectionId,
      [...filters, Query.limit(10), Query.offset(offset ?? 0)]
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
  offset,
  languages,
  searchText,
}: {
  offset?: number;
  eductaionCategory?: string[] | undefined | null;
  educationSubject?: string[] | undefined | null;
  languages?: string[] | null;
  searchText?: string;
}) {
  const filters = [
    Query.equal("kategoryType", "EDUCATION"),
    Query.equal("public", true),
  ];
  if (languages && languages.length > 0) {
    filters.push(Query.equal("creationLanguage", languages));
  }
  if (eductaionCategory && eductaionCategory.length > 0) {
    let eKat =
      eductaionCategory.length > 1
        ? eductaionCategory
        : [eductaionCategory[0], eductaionCategory[0]];
    const categoryFilters = eKat.map((kat) =>
      Query.contains("creationEducationKathegory", kat)
    );
    console.log("💡Category Filters:", categoryFilters);
    filters.push(Query.or(categoryFilters));
  }
  if (educationSubject && educationSubject.length > 0) {
    let eSub =
      educationSubject.length > 1
        ? educationSubject
        : [educationSubject[0], educationSubject[0]];
    const subjectFilters = eSub.map((sub) =>
      Query.contains("creationEducationSubject", sub)
    );
    filters.push(Query.or(subjectFilters));
  }
  if (searchText && searchText.trim() !== "") {
    filters.push(Query.contains("name", searchText));
  }
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.moduleCollectionId,
      [...filters, Query.limit(10), Query.offset(offset ?? 0)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching education modules:", error);
    return [];
  }
}
