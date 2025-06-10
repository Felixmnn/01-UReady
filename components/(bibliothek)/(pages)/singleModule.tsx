import { View, Text, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native';
import RoadMap from '../(sections)/roadMap';
import Data from '../(sections)/data';
import Header from '../(sections)/header';
import SwichTab from '../../(tabs)/swichTab';
import { addDocumentConfig, addDocumentToBucket, addNote, removeDocumentConfig, updateDocumentConfig, updateModule } from '@/lib/appwriteEdit';
import uuid from 'react-native-uuid';
import * as DocumentPicker from 'expo-document-picker';
import { getAllDocuments, getModuleAmout, getSessionNotes, getSessionQuestions } from '@/lib/appwriteQuerys';
import { updateModuleData } from '@/lib/appwriteUpdate';
import ModalNewQuestion from '../(modals)/newQuestion';
import AiQuestion from '../(modals)/aiQuestion';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useGlobalContext } from '@/context/GlobalProvider';
import languages  from '@/assets/exapleData/languageTabs.json';

/**
 * The SingleModule Component is responsible for rendering the deatils of a single module.
 * @param setSelectedScreen - Is used to navigate on the bibliothek screen. Between the different modules.
 * @param moduleEntry - The module entry is the currently selected module.
 */
const SingleModule = ({setSelectedScreen, moduleEntry, modules, setModules}) => {

    {/* Dimensions and Window Measurements */}
    const { width, } = useWindowDimensions();
    const tabWidth = width / 2;
    const isVertical = width > 700;
    const [ tab, setTab ] = useState(0)
    const [loading, setLoading] = useState(true);
    console.log("Modules in SingleModule:", modules);

    {/* Relevant Data - Modules $ Sessions */}
    const [module, setModule] = useState({
        ...moduleEntry,
        questionList: moduleEntry.questionList.map(item => JSON.parse(item))
    });
    const [selectedSession, setSelectedSession] = useState(0)
    const [questions, setQuestions] = useState([]);
    const [notes, setNotes] = useState([]);
    const [documents, setDocuments] = useState([]);
    const parsedSessions = module.sessions.map(session => JSON.parse(session));
    const [sessions, setSessions] = useState(parsedSessions);
    {/* Language and Texts */}
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    const { language } = useGlobalContext()

     const [ refreshing, setRefreshing ] = useState(false)
        const onRefresh = () => {
            setRefreshing(true);

            setTimeout(() => {
            setRefreshing(false);
            }, 2000);
        };
    

    useEffect(() => {
        if(language) {
            setSelectedLanguage(language)
        }
    }, [language])
    const texts = languages.singleModule; 
    /**
     * This function updates the sessions each time the sessions change.
     * The sessions are each stored as a JSON string in the module.
     */
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
   /**
    * This function gets the amount of the questions and notes from the module.
    * It then updates the question and note count in the module
    */
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
    /**
     * The Function recives a Array of Questions and calcultes how many percent are null, good, bad, ok or great.
     *
     * @param {Array} questions - Array of question objects.
     */
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
    //This function is used to fetch the questions, notes and documents for the a new session.
    useEffect(() => { 
        async function fetchQuestions(sessionID) {
            const sessionQuestions = await getSessionQuestions(sessionID)
            setQuestionLoadedSessions([...questionLoadedSessions,sessionID])

            
            const percent = calculatePercent(sessionQuestions);
            sessions.forEach((session) => {
                
                if (
                    session.id === sessionID &&
                    (session.percent !== percent || session.questions !== sessionQuestions.length)
                ) {
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
            
            const notes = await getSessionNotes(sessionID);
            const documents = await getAllDocuments(sessionID);

            if (questions) {
                setQuestions((prevQuestions) => [...prevQuestions, ...sessionQuestions]);  
            }
           
            
            if (notes) {
                setNotes(notes)  
            }
            
            if (documents) {
                
                setDocuments(documents)
            }
                
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
    }, [sessions, selectedSession, refreshing])
    /**
     * Switches to the EditNote screen with a new empty note.
     */
    async function SwichToEditNote() {
        setIsVisibleNewQuestion(false);
        const note = {
            notiz: "",
            sessionID: sessions[selectedSession].id,
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
    /**
     * This function loads a document from the users device and uploads it to the Appwrite bucket.
     * Additioally, a document config is created wich contains the relevant data for the document.
    */
    async function addDocument() {
        try {
            const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    
            if (res.canceled) return;
    
            const file = res.assets[0];
    
            const doc = {
                title: file.name,
                subjectID: module.$id,
                sessionID: sessions[selectedSession].id,
                id: uuid.v4(),
                type: file.mimeType || "application/octet-stream",
                uploaded: false,
            };
    
            setDocuments([...documents, doc]);
    
            // Step 2 - Save the config
            const appwriteRes = await addDocumentConfig(doc);
    
            // Step 3 - Read the file differently based on platform
            let fileBlob;
            if (Platform.OS === 'web') {
                // Web: fetch URI as Blob
                fileBlob = await fetch(file.uri).then(res => res.blob());
            } else {
                // Native (Android/iOS): read file as base64, then convert to Blob
                const base64 = await FileSystem.readAsStringAsync(file.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                const byteCharacters = atob(base64);
                const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
                const byteArray = new Uint8Array(byteNumbers);
                fileBlob = new Blob([byteArray], { type: file.mimeType || 'application/octet-stream' });
            }
            const uploadRes = await addDocumentToBucket({
                fileID: doc.id,
                fileBlob: fileBlob,
            });
            setDocuments(documents.map(document => document.id === doc.id ? {...document, uploaded: true} : document));
            appwriteRes.uploaded = true;
            const final = await updateDocumentConfig(appwriteRes);
            setDocuments(documents.map(document => document.id === doc.id ? final : document));
            return;

            
    
        } catch (error) {
            console.log('Error in addDocument:', error);
        }
    }
    /**
     * This function removes a document locally and deletes it from the Appwrite bucket.
     * @param {string} id - The ID of the document to update.
     */
    async function deleteDocument (id){
        try {
            setDocuments(documents.filter(document => document.$id !== id));
            removeDocumentConfig(id);
        } catch (error) {
            console.log(error);
        }
    }

    const [ isVisibleNewQuestion, setIsVisibleNewQuestion ] = useState(false)
    const [ isVisibleAI, setIsVisibleAI ] = useState(false)
    const [ change, setChange ] = useState(0)

    /**
     * This function checks for each question if it is in the questionList.
     * If not, it adds the question with the status null to ensure that there is a new state for each user.
     * In case the question List changes it checks if the Array needs to be updated.
     */
    useEffect(() => {
    async function updateQuestionList() {
        let hasChanges = false;

        questions.forEach((question) => {
            const existing = module.questionList.find(item => item.id === question.$id);
            if (!existing) {
                module.questionList.push({
                    id: question.$id,
                    status: null
                });
                hasChanges = true;
            } 
        });

        if (hasChanges) {
            const res = await updateModuleData(module.$id, {
                questionList: module.questionList.map(item => JSON.stringify(item)),
                questions: module.questionList.length,
                progress: calculatePercent(questions)
            });
        } else {
            console.log("ℹ️ Keine Änderungen an questionList – kein Update nötig.");
        }
    }

    updateQuestionList();
}, [questions]);

   useEffect(() => {
        setTab(1)
        setChange(change + 1)
   },[selectedSession])

    
    console.log("Module Entry in SingleModule:", questions, module.$id);

    return (
        <View className='flex-1 rounded-[10px] items-center '>
            <ModalNewQuestion documents={documents} texts={texts} selectedLanguage={selectedLanguage} SwichToEditNote={SwichToEditNote} addDocument={addDocument} sessions={sessions} selected={selectedSession} module={module} isVisible={isVisibleNewQuestion} setIsVisible={setIsVisibleNewQuestion} setSelected={setSelectedScreen} selectAi={()=> {setIsVisibleNewQuestion(false); setIsVisibleAI(true) } } /> 
            <AiQuestion uploadDocument={addDocument} sessions={sessions} setSessions={setSessions} documents={documents} questions={questions} setQuestions={setQuestions} selectedSession={sessions[selectedSession]} isVisible={isVisibleAI} setIsVisible={setIsVisibleAI} selectedModule={module} />

            {isVertical ? <View className=' h-[15px] w-[95%] bg-gray-900 bg-opacity-70 rounded-t-[10px]  opacity-50'></View> : null }
            <View className='flex-1 rounded-[10px] w-full bg-gray-900  border-gray-700 '>
                { loading ? <Text>...</Text> :
                <View className='flex-1'>
                <Header 
                    moduleID={module.$id}
                    moduleName={module.name} texts={texts} selectedLanguage={selectedLanguage} isVisibleAI={isVisibleAI} setIsVisibleAI={setIsVisibleAI}
                    isVisibleNewQuestion={isVisibleNewQuestion} setIsVisibleNewQuestion={setIsVisibleNewQuestion} moduleSessions={sessions}
                    questions={questions} setQuestions={setQuestions} addDocument={addDocument} setSelectedScreen={setSelectedScreen}
                    selectedModule={module} selected={selectedSession} sessions={sessions}  setSessions={setSessions}
                    modules={modules}
                    setModules={setModules}
                    setSelectedModule={setSelectedScreen}
                    
                    />
                {!isVertical ? <SwichTab tabWidth={tabWidth} setTab={setTab} tab={tab} tab1={"Map"} tab2={"Fragen"} bg={"bg-gray-900"} change={change}/> : null }
                <View className={`border-t-[1px] border-gray-600 ${isVertical ? "mt-3" : null}`}/>
                
                <View className={`flex-1 ${isVertical ? "flex-row" : null}`}>
                        { 
                            tab == 0 ?
                            
                            <View className='h-full flex-1 border-gray-600 border-l-[1px] p-4 max-w-[500px]'>
                                <RoadMap moduleID={moduleEntry.$id} texts={texts} selectedLanguage={selectedLanguage} change={change} setChange={setChange} setTab={setTab} moduleSessions={sessions} selected={selectedSession} setSelected={setSelectedSession} questions={questions} currentModule={module}/> 
                            </View>
                            : null
                        }
                        {isVertical || tab == 1 ?
                            <View className='p-4 flex-1'>
                                <Data refreshing={refreshing} onRefresh={onRefresh}  texts={texts} selectedLanguage={selectedLanguage} SwichToEditNote={SwichToEditNote} setSelected={setSelectedScreen} setIsVisibleAI={setIsVisibleAI} addDocument={addDocument} deleteDocument={deleteDocument} moduleSessions={sessions} selected={selectedSession} questions={questions} notes={notes} documents={documents} module={module}/>
                            </View>
                            : null 
                        }
                        { 
                            isVertical ?
                            
                            <View className='h-full flex-1 border-gray-600 border-l-[1px] p-4 max-w-[500px]'
                                style={{
                                    maxWidth: 400,
                                }}
                            >
                                <RoadMap moduleDescription={moduleEntry.description} moduleID={moduleEntry.$id} texts={texts} selectedLanguage={selectedLanguage} change={change} setChange={setChange} setTab={setTab} moduleSessions={sessions} selected={selectedSession} setSelected={setSelectedSession} questions={questions} currentModule={module}/> 
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