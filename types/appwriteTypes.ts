export type UserUsage = {
    streak: number;
    streakActive: boolean;
    streakLastUpdate: string | null;
    energy: number;
    microchip: number;
    boostActive: boolean
    boostActivation: string | null;
    boostType: string | null;
    lastModules: string[]; 
    lastSessions: string[];
    recharges: number;
    supercharges: number;
    purcharses: string[];
    watchedCommercials: string[];
    participatedQuizzes: string[];
    streakUpdate: string | null;
}

export type userDataKathegory = {
    $id?: string;
    country: string | null;
    university: string | null;
    region: string | null;
    studiengangZiel: string | null;
    schoolType: string | null;
    kategoryType: string | null;
    schoolSubjects: string[];
    schoolGrade: number | null;
    educationSubject: string | null;
    educationKathegory: string;
    language: string | null;
    faculty: string[];
    studiengang: string[];
    studiengangKathegory: string;
}

export type userData = {
    darkmode: boolean;
    language: string;
    uid:string;
    subscription: string | null;
    profilePicture: string | null;
    birthday: string | null;
    signInProcessStep: string;
    country: string | null;
    university: string | null;
    city: string | null;
}

export type question = {
    $id?: string;
    question: string;
    answers: string[];
    answerIndex: Array<number>;
    public: boolean;
    aiGenerated: boolean;
    status: string;
    tags : string[];
    sessionID: string | null;
    subjectID: string | null;
    questionUrl: string | null;
    questionLatex: string | null;
    questionSVG: string | null;
    explaination: string | null;
    hint: string | null;
}

export type note = {
    $id?: string;
    notiz: string;
    subjectID: string | null;
    sessionID: string | null;
    title: string | null;
    public: boolean;
}

export type module = {
    $id?: string;
    name: string;
    subject: string;
    questions: number;
    notes: number;
    documents: number;
    public: boolean;
    progress: number;
    creator: string;
    color: string | null;
    sessions: string[];
    tags: string[];
    description: string;
    releaseDate: string;
    connectedModules: string[];
    qualityScore: number;
    duration: number;
    upvotes: number;
    downVotes: number;
    creationCountry: string;
    creationUniversity: string | null;
    creationUniversityProfession: string | null;
    creationRegion: string | null;
    creationSchoolForm: string | null;
    creationKlassNumber: number | null;
    creationLanguage: string | null;
    creationUniversitySubject: string[];
    creationUniversityFaculty: string[];
    studiengangKathegory: string[];
    creationEducationKathegory: string | null;
    creationSubject: string[];
    copy: boolean;
    creationEducationSubject: string | null;
    questionList: string[];
    synchronization: boolean;
    kategoryType: string;

}

export type documentJob = {
    databucketID: string;
    sessionID: string;
    subjectID: string;
}

export type documentConfig = {
    title: string;
    sessionID: string;
    subjectID: string;
    databucketID: string;
    seitenanzahl: number;
    filetype: string;
    uploaded: boolean;
    $id?: string;
}

export type AppwriteDocument = {
  $id: string;
  title: string;
  type: string;
  subjectID: string;
  sessionID: string;
  uploaded: boolean;
};



