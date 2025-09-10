export type ModuleProps = {
    name: string;
    subject: string;
    questions: number;
    notes: number;
    documents: number;
    public: boolean;
    progress: number;
    creator: string;
    color: string | null;
    sessions: Array<any>;
    tags: Array<string>;
    description: string;
    releaseDate: Date | null;
    connectedModules: Array<string>;
    qualityScore: number;
    duration: number;
    upvotes: number;
    downVotes: number;
    creationCountry: string | null;
    creationUniversity: string | null;
    creationUniversityProfession: string | null;
    creationRegion: string | null;
    creationUniversitySubject: Array<string>;
    creationSubject: Array<string>;
    creationEducationSubject: string | null;
    creationUniversityFaculty: Array<string>;
    creationSchoolForm: string | null;
    creationKlassNumber: number | null;
    creationLanguage: string | null;
    creationEducationKathegory: string;
    studiengangKathegory: string;
    kategoryType: string;
    copy: boolean;
    questionList: Array<any>;
    synchronization: boolean;

};

export type userData = {
  $id: string;
  country: string | null;
  university: string | null;
  studiengangZiel: string | null;
  region: string | null;
  studiengang: Array<string>;
  schoolSubjects: Array<string>;
  educationSubject: string | null;
  faculty: Array<string>;
  schoolType: string | null;
  schoolGrade: number | null;
  language: string | null;
  educationKathegory: string;
  studiengangKathegory: string;
  kategoryType: string;
  tutorialCompleted: boolean;
  signInProcessStep: string;
  createdAt: string;
  updatedAt: string;
}

export type UserData = {
   country: string | null;
   university: string | null;
   faculty: Array<string>;
   studiengang: Array<string>;
    region: string | null;
    studiengangZiel: string | null;
    schoolType: string | null;
    kategoryType: string | null;
    schoolSubjects: Array<string>;
    schoolGrade: number | null;
    educationSubject: string | null;
    educationKathegory: string;
    language: string | null;
    studiengangKathegory: string;
}