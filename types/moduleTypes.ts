export type ModuleProps = {
    $id?: string;
    name: string;
    subject: string;
    questions: number;
    notes: number;
    documents: number;
    public: boolean;
    progress: number;
    creator: string;
    color: string | null | undefined;
    sessions: string[];
    tags: string[];
    description: string;
    releaseDate: Date | null;
    connectedModules: string[];
    qualityScore: number;
    duration: number;
    upvotes: number;
    downVotes: number;
    creationCountry: string | null;
    creationUniversity: string | null;
    creationUniversityProfession: string | null;
    creationRegion: string | null;
    creationUniversitySubject: string[];
    creationSubject: string[];
    creationEducationSubject: string | null;
    creationUniversityFaculty: string[];
    creationSchoolForm: string | null;
    creationKlassNumber: number | null;
    creationLanguage: string | null;
    creationEducationKathegory: string;
    studiengangKathegory: string;
    kategoryType: string;
    copy: boolean;
    questionList: string[];
    synchronization: boolean;

};

export type userData = {
  $id: string;
  country: string | null;
  university: string | null;
  studiengangZiel: string | null;
  region: string | null;
  studiengang: string[];
  schoolSubjects: string[];
  educationSubject: string | null;
  faculty: string[];
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
    $id?: string;
   country: string | null;
   university: string | null;
   faculty: string[];
   studiengang: string[];
    region: string | null;
    studiengangZiel: string | null;
    schoolType: string | null;
    kategoryType: string | null;
    schoolSubjects: string[];
    schoolGrade: number | null;
    educationSubject: string | null;
    educationKathegory: string;
    language: string | null;
    studiengangKathegory: string;
}

export type Session = {
    title: string;
    percent: number;
    color: string;
    iconName: string;
    questions: number;
    description: string;
    tags: string[];
    id: string;
    generating: boolean;

}