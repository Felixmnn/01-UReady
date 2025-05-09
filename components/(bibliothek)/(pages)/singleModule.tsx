import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native';
import RoadMap from '../(sections)/roadMap';
import Data from '../(sections)/data';
import Header from '../(sections)/header';
import { quizQuestion } from '@/assets/exapleData/quizQuestion';
import SwichTab from '../../(tabs)/swichTab';
import { addDocumentConfig, addDocumentToBucket, addNote, removeDocumentConfig, updateDocumentConfig, updateModule } from '@/lib/appwriteEdit';
import uuid from 'react-native-uuid';
import * as DocumentPicker from 'expo-document-picker';
import { getModuleAmout, getQuestions, getSessionQuestions } from '@/lib/appwriteQuerys';
import { updateModuleData } from '@/lib/appwriteUpdate';
import ModalNewQuestion from '../(modals)/newQuestion';
import AiQuestion from '../(modals)/aiQuestion';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

const SingleModule = ({setSelectedScreen, module}) => {
    const { width } = useWindowDimensions();
    const { language } = useGlobalContext()
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    useEffect(() => {
    if(language) {
        setSelectedLanguage(language)
    }
    }, [language])

    const texts = {
        "DEUTSCH":{
            title: "Alle Fragen",
            sessions: "Sessions",
            addMaterial: "Material hinzufügen",
            learnNow: "Jetzt lernen",
            questio: "Fragen",
            questioH: "Frage hinzufügen",
            questioSH: "Erstelle deine erste Frage.",
            questioBtn: "Frage erstellen",
            file: "Dateien",
            fileH: "Datei hinzufügen",
            fileSH: "Lade deine erste Datei hoch",
            fileBtn: "Dokument hochladen",
            note: "Notizen",
            noteH: "Notiz hinzufügen",
            noteSH: "Erstelle deine erste Notiz.",
            noteBtn: "Notiz erstellen",
            share: "Teilen",
            unsupported: "Nicht unterstützter Dateityp",
            unnamed: "Unbenannt",
            recommended:"Empfolen",
            aiQuiz: "AI Quiz generieren",
            dokUpload: "Dokument hochladen",
            crtQuestio: "Frage erstellen",
            crtNote: "Notiz erstellen",

        },
        "ENGLISH(US)":{
            title: "All Questions",
            sessions: "Sessions",
            addMaterial: "Add Material",
            learnNow: "Learn Now",
            questio: "Questions",
            questioH: "Add Question",
            questioSH: "Create your first question.",
            questioBtn: "Create Question",
            file: "Files",
            fileH: "Add File",
            fileSH: "Upload your first file",
            fileBtn: "Upload Document",
            note: "Notes",
            noteH: "Add Note",
            noteSH: "Create your first note.",
            noteBtn: "Create Note",
            share: "Share",
            unsupported: "Unsupported file type",
            unnamed: "Unnamed",
            recommended:"Recommended",
            aiQuiz: "Generate AI Quiz",
            dokUpload: "Upload Document",
            crtQuestio: "Create Question",
            crtNote: "Create Note",

        },
        "ENGLISH(UK)":{
            title: "All Questions",
            sessions: "Sessions",
            addMaterial: "Add Material",
            learnNow: "Learn Now",
            questio: "Questions",
            questioH: "Add Question",
            questioSH: "Create your first question.",
            questioBtn: "Create Question",
            file: "Files",
            fileH: "Add File",
            fileSH: "Upload your first file",
            fileBtn: "Upload Document",
            note: "Notes",
            noteH: "Add Note",
            noteSH: "Create your first note.",
            noteBtn: "Create Note",
            share: "Share",
            unsupported: "Unsupported file type",
            unnamed: "Unnamed",
            recommended:"Recommended",
            aiQuiz: "Generate AI Quiz",
            dokUpload: "Upload Document",
            crtQuestio: "Create Question",
            crtNote: "Create Note",

        },
        "AUSTRALIAN":{
            title: "All Questions",
            sessions: "Sessions",
            addMaterial: "Add Material",
            learnNow: "Learn Now",
            questio: "Questions",
            questioH: "Add Question",
            questioSH: "Create your first question.",
            questioBtn: "Create Question",
            file: "Files",
            fileH: "Add File",
            fileSH: "Upload your first file",
            fileBtn: "Upload Document",
            note: "Notes",
            noteH: "Add Note",
            noteSH: "Create your first note.",
            noteBtn: "Create Note",
            share: "Share",
            unsupported: "Unsupported file type",
            unnamed: "Unnamed",
            recommended:"Recommended",
            aiQuiz: "Generate AI Quiz",
            dokUpload: "Upload Document",
            crtQuestio: "Create Question",
            crtNote: "Create Note",

        },
        "SPANISH":{
            title: "Todas las preguntas",
            sessions: "Sesiones",
            addMaterial: "Agregar material",
            learnNow: "Aprender ahora",
            questio: "Preguntas",
            questioH: "Agregar pregunta",
            questioSH: "Crea tu primera pregunta.",
            questioBtn: "Crear pregunta",
            file: "Archivos",
            fileH: "Agregar archivo",
            fileSH: "Sube tu primer archivo",
            fileBtn: "Subir documento",
            note: "Notas",
            noteH: "Agregar nota",
            noteSH: "Crea tu primera nota.",
            noteBtn: "Crear nota",
            share: "Compartir",
            unsupported: "Tipo de archivo no compatible",
            unnamed: "Sin nombre",
            recommended:"Recomendado",
            aiQuiz: "Generar cuestionario AI",
            dokUpload: "Subir documento",
            crtQuestio: "Crear pregunta",
            crtNote: "Crear nota",

        },
    }

    
    const tabWidth = width / 2;
    const [selectedSession, setSelectedSession] = useState(0)
    const [ tab, setTab ] = useState(0)
    const isVertical = width > 700;
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    
    const [notes, setNotes] = useState([]);
    const [documents, setDocuments] = useState([]);

    const parsedSessions = module.sessions.map(session => JSON.parse(session));
    const [sessions, setSessions] = useState(parsedSessions);

    useEffect(() => {
        async function updateModuleLocal () {
            const newModule = {
                ...module,
                sessions: sessions.map(session => JSON.stringify(session))
        }
        await updateModule(newModule);
    
    }
    updateModuleLocal()
    }, [sessions])

    

    useEffect(() => {
        if (!module) return;
        async function fetchQuestions() {
            const res = await getModuleAmout(module.$id)
            const resToRes = await updateModuleData(module.$id,{"questions":res?.questions,"notes":res?.notes})
        }
    
        fetchQuestions()
    }
    , [module])

    const [ questionLoadedSessions, setQuestionLoadedSessions ] = useState([])
      
    function calculatePercent(questions) {
        let points = 0;
        if (!questions || questions.length === 0) return 100;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].status === "BAD") {
                points -= 1;
            } else if (questions[i].status === "GOOD") {
                points += 1;
            } else if (questions[i].status === "GREAT") {
                points += 1.5;
            } else if (questions[i].status === "OK") {
                points += 0.5;
            }
        }
        const percent = Math.round((points / questions.length) * 100);
        return percent < 0 ? 0 : percent > 100 ? 100 : percent;
    }
    //Methode um die Fragen zu laden 
    useEffect(() => { 
        async function fetchQuestions(sessionID) {
            const sessionQuestions = await getSessionQuestions(sessionID)
            setQuestionLoadedSessions([...questionLoadedSessions,sessionID])
            const percent = calculatePercent(sessionQuestions);
            console.log("😒😒😒😒",percent)
            sessions.forEach((session) => {
                
                if (
                    session.id === sessionID &&
                    (session.percent !== percent || session.questions !== sessionQuestions.length)
                ) {
                    console.log("Session updated:", sessionID, percent, sessionQuestions.length);
                    setSessions((prevSessions) => {
                        const updatedSessions = [...prevSessions];
                        const index = updatedSessions.findIndex((s) => s.id === sessionID);
            
                        if (index !== -1) {
                            updatedSessions[index] = {
                                ...updatedSessions[index],
                                percent: percent,
                                questions: sessionQuestions.length,
                            };
                        }
            
                        return updatedSessions;
                    });
                }
            });
            
            //const notes = await loadNotes();
            //const documents = await loadDocuments();
            if (questions) {
                setQuestions((prevQuestions) => [...prevQuestions, ...sessionQuestions]);  
            }
            
            /*
            if (notes) {
                const noteArray = notes.documents
                const filteredNotes = noteArray.filter((note) => note.subjectID == module.$id);
                setNotes(filteredNotes)  
            }
            if (documents) {
                const docArray = documents.documents
                const filteredDocuments = docArray.filter((document) => document.subjectID == module.$id);
                setDocuments(filteredDocuments)
            }
                */
        }
        if ( sessions == undefined || selectedSession > sessions.length || questionLoadedSessions.includes(sessions[selectedSession].id) ) {
            if (selectedSession > sessions.length) {
                for (let i = 0; i < sessions.length; i++) {
                    if (!questionLoadedSessions.includes(sessions[i].id)) {
                        fetchQuestions(sessions[i].id);
                        setQuestionLoadedSessions([...questionLoadedSessions, sessions[i].id])
                    } 
                }
            }
        } else {
            fetchQuestions(sessions[selectedSession].id);
        }
        setLoading(false) 
    }, [sessions, selectedSession])


    async function SwichToEditNote() {
        setIsVisibleNewQuestion(false);
    

    
        const note = {
            notiz: "",
            sessionID: sessions[selectedSession].title,
            subjectID: module.$id,
            title: "",
        }
        try {
            
            const res = await addNote(note);
            router.push({
                pathname:"editNote",
                params: {note: JSON.stringify(res)}
            })
        } catch (error) {
            console.log(error);
        }}




    async function addDocument (){
        try {
             
            const res = await DocumentPicker.getDocumentAsync({type: "*/*"});

            if (res.canceled) {
                return;
            }
            //Step 1 - Create a new Document-Config
            const file = res.assets[0];

            const doc = {
                title: file.name,
                subjectID: module.$id,
                sessionID: sessions[selectedSession].id,
                id: uuid.v4(),
                type: file.mimeType,
                uploaded:false,
            }
            setDocuments([...documents, doc]);
            //Step 2 - Save the Document-Config
            let appwriteRes = await addDocumentConfig(doc);
            if (appwriteRes) {
            }
            //Step 3 - Upload the Document
            const fileBlob = await fetch(file.uri).then(res => res.blob());
            const data = {
                fileID: doc.id,
                fileBlob: fileBlob,
            }
            const uploadRes = await addDocumentToBucket(data);
            //Set Upload to true && close the modal
            setDocuments(documents.map(document => document.id === doc.id ? {...document, uploaded: true} : document));
            appwriteRes.uploaded = true;
            const final = await updateDocumentConfig(appwriteRes);
            setDocuments(documents.map(document => document.id === doc.id ? final : document));
            return;
                        
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteDocument (id){
        try {
            setDocuments(documents.filter(document => document.$id !== id));
            removeDocumentConfig(id);
        } catch (error) {
            console.log(error);
        }
    }

    const [ isVisibleNewQuestion, setIsVisibleNewQuestion ] = useState(false)
    const [isVisibleAI, setIsVisibleAI] = useState(false)
    const [showSessionList, setShowSessionList] = useState(false)
    const [ change, setChange ] = useState(0)
    

    return (
        <View className='flex-1 items-center '>
            <ModalNewQuestion texts={texts} selectedLanguage={selectedLanguage} SwichToEditNote={SwichToEditNote} addDocument={addDocument} sessions={sessions} selected={selectedSession} module={module} isVisible={isVisibleNewQuestion} setIsVisible={setIsVisibleNewQuestion} setSelected={setSelectedScreen} selectAi={()=> {setIsVisibleNewQuestion(false); setIsVisibleAI(true) } } /> 
            <AiQuestion questions={questions} setQuestions={setQuestions} selectedSession={sessions[selectedSession]} isVisible={isVisibleAI} setIsVisible={setIsVisibleAI} selectedModule={module} />

            {isVertical ? <View className=' h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }
            <View className='flex-1 w-full bg-gray-900  border-gray-700 '>
                { loading ? <Text>Skeleton View</Text> :
                <View className='flex-1'>
                <Header texts={texts} selectedLanguage={selectedLanguage} isVisibleAI={isVisibleAI} setIsVisibleAI={setIsVisibleAI} isVisibleNewQuestion={isVisibleNewQuestion} setIsVisibleNewQuestion={setIsVisibleNewQuestion} moduleSessions={sessions} questions={questions} setQuestions={setQuestions} addDocument={addDocument} setSelectedScreen={setSelectedScreen} selectedModule={module} selected={selectedSession} sessions={sessions}  setSessions={setSessions}/>
                {!isVertical ? <SwichTab tabWidth={tabWidth} setTab={setTab} tab={tab} tab1={"Map"} tab2={"Fragen"} bg={"bg-gray-900"} change={change}/> : null }
                <View className={`border-t-[1px] border-gray-600 ${isVertical ? "mt-3" : null}`}/>
                
                <View className={`flex-1 ${isVertical ? "flex-row" : null}`}>
                        { 
                            tab == 0 ?
                            <View className='p-4 flex-1'>
                                <Data texts={texts} selectedLanguage={selectedLanguage} SwichToEditNote={SwichToEditNote} setSelected={setSelectedScreen} setIsVisibleAI={setIsVisibleAI} addDocument={addDocument} deleteDocument={deleteDocument} moduleSessions={sessions} selected={selectedSession} questions={questions} notes={notes} documents={documents}/>
                            </View>
                            : null
                        }
                        {isVertical || tab == 1 ?
                            <View className='h-full flex-1 border-gray-600 border-l-[1px] p-4 max-w-[700px]'>
                                <RoadMap texts={texts} selectedLanguage={selectedLanguage} change={change} setChange={setChange} setTab={setTab} moduleSessions={sessions} selected={selectedSession} setSelected={setSelectedSession} questions={questions} currentModule={module}/> 
                            </View>
                            : null 
                        }
                </View>
                </View>
                }   
            </View>       
        </View>
    )
}

export default SingleModule