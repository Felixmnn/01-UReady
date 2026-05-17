
import { module, note, question } from "@/types/appwriteTypes";
import { Session } from "@/types/moduleTypes";

type AppwriteDocument = {
  $id: string;
  title: string;
  fileType: string;
  subjectID: string;
  sessionID: string;
  uploaded: boolean;
  databucketID: string;
  status: string;
  textChunks?: string[];
};

export const SAMPLE_US_MATH_QUESTION: question = {
  $id: "sample-us-math-001",
  question:
    "¿Cuál es la solución correcta de la siguiente ecuación?",
  answers: [
    "x = {3, -1/2}",
    "x = {3, 1/2}",
    "x = {-3, 1/2}",
    "x = {-3, -1/2}",
  ],
  answerIndex: [0],
  public: true,
  aiGenerated: false,
  status: "GOOD",
  tags: ["Álgebra", "Cálculo", "Ingeniería"],
  sessionID: "session-demo-es-maths",
  subjectID: "module-demo-es-calculo",
  questionUrl: null,
  questionLatex: "2x^2 - 5x - 3 = 0",
  questionSVG: null,
  explaination:
    "Factorizamos: (2x + 1)(x - 3). Las soluciones son x = -1/2 y x = 3.",
  hint:
    "Intenta factorizar antes de usar la fórmula cuadrática.",
};

export const demoQuestionList = (statuses: string[]) =>
  statuses.map((status) => JSON.stringify({ status }));

const screenshotDemoModules: module[] = [
  {
    $id: "demo-module-fr-1",
    name: "Cálculo diferencial",
    subject: "Matemáticas",
    questions: 64,
    notes: 12,
    documents: 3,
    public: true,
    progress: 82,
    creator: "QReady Team",
    color: "BLUE",
    sessions: [],
    tags: ["Ingeniería", "Universidad"],
    description:
      "Límites, derivadas y optimización para estudiantes de ingeniería.",
    releaseDate: "2026-01-10",
    connectedModules: [],
    qualityScore: 95,
    duration: 180,
    upvotes: 0,
    downVotes: 0,
    creationCountry: "Spain",
    creationUniversity: "Universidad Politécnica de Madrid",
    creationUniversityProfession: "Ingeniería",
    creationRegion: "Madrid",
    creationSchoolForm: null,
    creationKlassNumber: null,
    creationLanguage: "Spanish",
    creationUniversitySubject: ["Matemáticas"],
    creationUniversityFaculty: ["Ingeniería"],
    studiengangKathegory: ["University"],
    creationEducationKathegory: "University",
    creationSubject: ["Matemáticas"],
    copy: false,
    creationEducationSubject: "Matemáticas",
    questionList: demoQuestionList([
      "GOOD",
      "GOOD",
      "GREAT",
      "OK",
      "GOOD",
      "GREAT",
      "GOOD",
      "GOOD",
      "OK",
      "GOOD",
    ]),
    synchronization: false,
    kategoryType: "education",
  },
  {
    $id: "demo-module-fr-2",
    name: "Programación en Python",
    subject: "Informática",
    questions: 58,
    notes: 9,
    documents: 2,
    public: true,
    progress: 74,
    creator: "QReady Team",
    color: "GREEN",
    sessions: [],
    tags: ["Python", "Programación"],
    description:
      "Variables, funciones, estructuras de datos y algoritmos básicos.",
    releaseDate: "2026-01-10",
    connectedModules: [],
    qualityScore: 92,
    duration: 150,
    upvotes: 0,
    downVotes: 0,
    creationCountry: "Spain",
    creationUniversity: "Universidad Politécnica de Madrid",
    creationUniversityProfession: "Ingeniería Informática",
    creationRegion: "Madrid",
    creationSchoolForm: null,
    creationKlassNumber: null,
    creationLanguage: "Spanish",
    creationUniversitySubject: ["Informática"],
    creationUniversityFaculty: ["Ingeniería"],
    studiengangKathegory: ["University"],
    creationEducationKathegory: "University",
    creationSubject: ["Informática"],
    copy: false,
    creationEducationSubject: "Informática",
    questionList: demoQuestionList([
      "GOOD",
      "OK",
      "GOOD",
      "GREAT",
      "GOOD",
      "GOOD",
      "OK",
      "GOOD",
    ]),
    synchronization: false,
    kategoryType: "education",
  },
  {
    $id: "demo-module-fr-3",
    name: "Química general",
    subject: "Química",
    questions: 49,
    notes: 7,
    documents: 1,
    public: true,
    progress: 68,
    creator: "QReady Team",
    color: "ORANGE",
    sessions: [],
    tags: ["Química", "Ingeniería"],
    description:
      "Enlaces químicos, reacciones y estequiometría.",
    releaseDate: "2026-01-10",
    connectedModules: [],
    qualityScore: 90,
    duration: 140,
    upvotes: 0,
    downVotes: 0,
    creationCountry: "Spain",
    creationUniversity: "Universidad Politécnica de Madrid",
    creationUniversityProfession: "Ingeniería",
    creationRegion: "Madrid",
    creationSchoolForm: null,
    creationKlassNumber: null,
    creationLanguage: "Spanish",
    creationUniversitySubject: ["Química"],
    creationUniversityFaculty: ["Ingeniería"],
    studiengangKathegory: ["University"],
    creationEducationKathegory: "University",
    creationSubject: ["Química"],
    copy: false,
    creationEducationSubject: "Química",
    questionList: demoQuestionList([
      "GOOD",
      "GOOD",
      "OK",
      "GREAT",
      "GOOD",
      "OK",
    ]),
    synchronization: false,
    kategoryType: "education",
  },
  {
    $id: "demo-module-fr-4",
    name: "Física mecánica",
    subject: "Física",
    questions: 53,
    notes: 10,
    documents: 2,
    public: true,
    progress: 71,
    creator: "QReady Team",
    color: "RED",
    sessions: [],
    tags: ["Física", "Ingeniería"],
    description:
      "Cinemática, fuerzas y leyes de Newton.",
    releaseDate: "2026-01-10",
    connectedModules: [],
    qualityScore: 91,
    duration: 155,
    upvotes: 0,
    downVotes: 0,
    creationCountry: "Spain",
    creationUniversity: "Universidad Politécnica de Madrid",
    creationUniversityProfession: "Ingeniería",
    creationRegion: "Madrid",
    creationSchoolForm: null,
    creationKlassNumber: null,
    creationLanguage: "Spanish",
    creationUniversitySubject: ["Física"],
    creationUniversityFaculty: ["Ingeniería"],
    studiengangKathegory: ["University"],
    creationEducationKathegory: "University",
    creationSubject: ["Física"],
    copy: false,
    creationEducationSubject: "Física",
    questionList: demoQuestionList([
      "GOOD",
      "GOOD",
      "GREAT",
      "OK",
      "GOOD",
      "GOOD",
      "GREAT",
    ]),
    synchronization: false,
    kategoryType: "education",
  },
];

export const moduleItems = screenshotDemoModules;

const useScreenshotTemplateCA = true;
const screenshotSessionId = "gwcetm";
const screenshotModuleId = "a1abf3a0-51b7-41aa-8cdd-66e9670be5ce";
const algebraSessionId = "gwcetm";
const analysisSessionId = screenshotSessionId;
const stochastikSessionId = screenshotSessionId;

export const templateQuestionsCA: question[] = [
  {
    $id: "demo-question-ca-1",
    question:
      "¿Cuál es la derivada de la siguiente función?",
    answers: ["x", "2x", "x²", "2"],
    answerIndex: [1],
    public: true,
    aiGenerated: false,
    status: "GOOD",
    tags: ["Cálculo diferencial", "Matemáticas"],
    sessionID: analysisSessionId,
    subjectID: screenshotModuleId,
    questionUrl: null,
    questionLatex: "f(x)=x^2",
    questionSVG: null,
    explaination:
      "Usando la regla de potencia, la derivada de x² es 2x.",
    hint: "Utiliza la regla de derivación de potencias.",
  },
  {
    $id: "demo-question-ca-2",
    question:
      "¿Qué estructura contiene el ADN de la célula?",
    answers: [
      "El núcleo",
      "La membrana celular",
      "El citoplasma",
      "Los ribosomas",
    ],
    answerIndex: [0],
    public: true,
    aiGenerated: false,
    status: "GOOD",
    tags: ["Biología celular"],
    sessionID: screenshotSessionId,
    subjectID: screenshotModuleId,
    questionUrl: null,
    questionLatex: null,
    questionSVG: null,
    explaination:
      "El núcleo contiene el ADN y controla las funciones celulares.",
    hint: "Piensa en la parte de la célula donde se almacena la información genética.",
  },
  {
    $id: "demo-question-ca-3",
    question:
      "¿Qué unidad se utiliza para medir una fuerza?",
    answers: ["Julio", "Vatio", "Newton", "Pascal"],
    answerIndex: [2],
    public: true,
    aiGenerated: false,
    status: "OK",
    tags: ["Física"],
    sessionID: screenshotSessionId,
    subjectID: screenshotModuleId,
    questionUrl: null,
    questionLatex: "F = ma",
    questionSVG: null,
    explaination:
      "La fuerza se mide en newtons (N).",
    hint: "Recuerda la segunda ley de Newton.",
  },
];

export const templateNotesCA: note[] = [
  {
    $id: "demo-note-ca-1",
    notiz:
      "Repasar derivadas antes del examen del jueves. Practicar ejercicios de optimización.",
    subjectID: screenshotModuleId,
    sessionID: screenshotSessionId,
    title: "Plan de estudio",
    public: false,
  },
  {
    $id: "demo-note-ca-2",
    notiz:
      "No olvidar: las mitocondrias producen energía para la célula.",
    subjectID: screenshotModuleId,
    sessionID: screenshotSessionId,
    title: "Biología",
    public: false,
  },
];

export const templateDocumentsCA: AppwriteDocument[] = [
  {
    $id: "demo-document-ca-1",
    title: "Resumen_Calculo_Diferencial.pdf",
    fileType: "application/pdf",
    subjectID: screenshotModuleId,
    sessionID: screenshotSessionId,
    uploaded: true,
    databucketID: "demo-bucket-ca-1",
    status: "DONE",
    textChunks: [
      "Límites y derivadas",
      "Optimización y funciones",
    ],
  },
  {
    $id: "demo-document-ca-2",
    title: "Apuntes_Biologia_Celular.pdf",
    fileType: "application/pdf",
    subjectID: screenshotModuleId,
    sessionID: screenshotSessionId,
    uploaded: true,
    databucketID: "demo-bucket-ca-2",
    status: "DONE",
    textChunks: [
      "ADN y células",
      "Transporte celular",
    ],
  },
];

export const exampleSessions = [
  {
    name: "Quiz de derivadas",
    percent: 88,
    color: "blue",
    icon: "calculator",
    questions: 20,
    sessionID: "default-session-1",
    quizType: "infinite",
    questionType: "single",
    questionAmount: 20,
    timeLimit: null,
    moduleID: "default-module-1",
  },
  {
    name: "Repaso de programación",
    percent: 81,
    color: "green",
    icon: "code",
    questions: 15,
    sessionID: "default-session-2",
    quizType: "infinite",
    questionType: "single",
    questionAmount: 15,
    timeLimit: null,
    moduleID: "default-module-2",
  },
  {
    name: "Ejercicios de química",
    percent: 73,
    color: "orange",
    icon: "flask-conical",
    questions: 10,
    sessionID: "default-session-3",
    quizType: "infinite",
    questionType: "single",
    questionAmount: 10,
    timeLimit: null,
    moduleID: "default-module-3",
  },
  {
    name: "Mecánica",
    percent: 79,
    color: "red",
    icon: "rocket",
    questions: 14,
    sessionID: "default-session-4",
    quizType: "infinite",
    questionType: "single",
    questionAmount: 14,
    timeLimit: null,
    moduleID: "default-module-4",
  },
];

export const exampleModules = [
  {
    name: "Programación en Python",
    percent: 78,
    color: "green",
    fragen: 64,
    sessions: 5,
    sessionID: "default-module-1",
  },
  {
    name: "Cálculo diferencial",
    percent: 85,
    color: "blue",
    fragen: 72,
    sessions: 4,
    sessionID: "default-module-2",
  },
  {
    name: "Química general",
    percent: 69,
    color: "orange",
    fragen: 90,
    sessions: 7,
    sessionID: "default-module-3",
  },
  {
    name: "Física mecánica",
    percent: 74,
    color: "red",
    fragen: 58,
    sessions: 4,
    sessionID: "default-module-4",
  },
];

export const moduleData = {
  name: "Pack de estudio de matemáticas",
  description:
    "Preparación para la universidad en álgebra, cálculo y probabilidad.",
};

export const sessionDataTitle = [
  "Fundamentos de álgebra",
  "Entrenamiento de cálculo",
  "Probabilidad y estadística",
];