import { View, Text, Platform, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native';
import RoadMap from '../(sections)/roadMap';
import Data from '../(sections)/data';
import Header from '../(sections)/header';
import SwichTab from '../../(tabs)/swichTab';
import { addDocumentConfig, addDocumentToBucket, addDocumentToBucketWeb, addNote, removeDocumentConfig, removeQuestion, updateDocumentConfig, updateModule } from '@/lib/appwriteEdit';
import uuid from 'react-native-uuid';
import * as DocumentPicker from 'expo-document-picker';
import { getAllDocuments, getModuleAmout, getSessionNotes, getSessionQuestions } from '@/lib/appwriteQuerys';
import { updateModuleData } from '@/lib/appwriteUpdate';
import ModalNewQuestion from '../(modals)/newQuestion';
import AiQuestion from '../(modals)/aiQuestion';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import languages  from '@/assets/exapleData/languageTabs.json';
import { useFocusEffect } from '@react-navigation/native';
import { loadModule } from '@/lib/appwriteDaten';

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


    
    function reverseToManyStringifyActions(array) {
        return array.map(item => {
            try {
                let result = item;
                while (typeof result === "string") {
                    try {
                    result = JSON.parse(result);
                    } catch (e) {
                    break;
                    }
                }
                return result;
            } catch (error) {
                console.error("Error parsing item:", item, error);
                return item; // Return the original item if parsing fails
            }
        });
        

    }
    {/* Relevant Data - Modules $ Sessions */}
    const [module, setModule] = useState({
        ...moduleEntry,
        questionList: reverseToManyStringifyActions(moduleEntry.questionList)
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
        async function onRefresh () {
            setRefreshing(true);
            await checkForUpdates()
            setTimeout(() => {
            setRefreshing(false);
            }, 2000);
        };
    
    useEffect(() => {
        if(language) {
            setSelectedLanguage(language)
        }
    }, [language])
    const [isError, setIsError] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.");
    
    const texts = languages.singleModule; 


    //____________________________________________________________Ende der Variablen____________________________________________________________


    /**
     * This function updates the sessions each time the sessions change.
     * The sessions are each stored as a JSON string in the module.
     */
    useEffect(() => {
        if (!module) return;
        async function updateModuleLocal () {
            const newModule = {
                ...module,
                sessions: sessions.map(session => JSON.stringify(session))
        }
        await updateModule(newModule);
    
    }
    updateModuleLocal()
    }, [sessions])
   
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

    //_____________________________________________________________When Selected Session Changes_____________________________________________________________
    /**
     * This function is called when the Page is reopened or the module is changed.
     */
    async function updateSessionData(sessionID="", percent=0, amountQuestions=0) {
         sessions.forEach((session) => {
                if (
                    session.id === sessionID &&
                    (session.percent !== percent || session.questions !== amountQuestions)
                ) {
                    setSessions((prevSessions) => {
                        const updatedSessions = [...prevSessions];
                        const index = updatedSessions.findIndex((s) => s.id === sessionID);
            
                        if (index !== -1) {
                            updatedSessions[index] = {
                                ...updatedSessions[index],
                                percent: percent,
                                questions: amountQuestions,
                            };
                        }
            
                        return updatedSessions;
                    });
                }
            });
    }

    async function fetchQuestions(sessionID) {
            const sessionQuestions = await getSessionQuestions(sessionID)
            setQuestionLoadedSessions([...questionLoadedSessions,sessionID])
            const percent = calculatePercent(sessionQuestions);
            await updateSessionData(sessionID, percent, sessionQuestions.length);
           
            const notes = await getSessionNotes(sessionID);
            const documents = await getAllDocuments(sessionID);
            const existingIds = questions.map(q => q.$id);
            const newQuestions = sessionQuestions.filter(q => !existingIds.includes(q.$id));
            if (newQuestions.length > 0) {
  setQuestions((prevQuestions) => {
    const combined = [...prevQuestions, ...newQuestions];
    const unique = combined.filter(
      (item, index, arr) => arr.findIndex((q) => q.$id === item.$id) === index
    );
    return unique;
  });
}
            //else {setQuestions(sessionQuestions);}
            if (notes) {setNotes(notes)}
            if (documents) {setDocuments(documents)}   
        }
    async function checkForUpdates() {
                const moduledata = await loadModule(module.$id);
                if (moduledata) {setModule(moduledata);}

                const questions = await getSessionQuestions(sessions[selectedSession].id);
                const notes = await getSessionNotes(sessions[selectedSession].id);
                const documents = await getAllDocuments(sessions[selectedSession].id);
                if (questions) {setQuestions(questions);}
                if (notes) {setNotes(notes)}
                if (documents) {setDocuments(documents);}
                const percent = calculatePercent(questions);
                setSessions((prevSessions) => {
                    return prevSessions.map((session) => {
                        if (session.id === sessions[selectedSession].id) {
                            return {
                                ...session,
                                percent: percent,
                                questions: questions.length,
                            };
                        }
                        return session;
                    });
                }
                );
            }
    
    //This effect causes Quetions rende
    useEffect(() => { 
        if ( sessions == undefined || selectedSession > sessions.length  ) {
            if (selectedSession > sessions.length) {
                for (let i = 0; i < sessions.length; i++) {
                    if (!questionLoadedSessions.includes(sessions[i].id)) {
                        fetchQuestions(sessions[i].id);
                        setQuestionLoadedSessions([...questionLoadedSessions, sessions[i].id])
                    } 
                }
            }
        } else {
            if (sessions[selectedSession]) fetchQuestions(sessions[selectedSession].id ); 
        }
        setLoading(false) 
    }, [sessions, selectedSession, refreshing])



    //_____________________________________________________________General Functions_____________________________________________________________
    
    useFocusEffect(
        React.useCallback(() => {
            checkForUpdates();
        },[]))
    /**
     * Switches to the EditNote screen with a new empty note.
     */
    async function SwichToEditNote() {
        setIsVisibleNewQuestion(false);
        const note = {
            notiz: "",
            sessionID: sessions[selectedSession] ? sessions[selectedSession].id : "",
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
            if (__DEV__) {
            console.log(error);
            }
        }}
    /**
     * This function loads a document from the users device and uploads it to the Appwrite bucket.
     * Additioally, a document config is created wich contaiMons the relevant data for the document.
    */
    async function addDocument() {
        try {
            const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
             
            if (res.canceled) return;
    
            const file = res.assets[0];
            if (file.mimeType !== 'application/pdf') {
                setIsError(true);
                setErrorMessage("Bitte nur PDF-Dateien hochladen.");
            return;
            }
            const doc = {
                title: file.name,
                subjectID: module.$id,
                sessionID: sessions[selectedSession].id,
                id: uuid.v4(),
                type: file.mimeType || "application/octet-stream",
                uploaded: false,
            };
    
    
            // Step 2 - Save the config
            const appwriteRes = await addDocumentConfig(doc);

            // Step 3 - Read the file differently based on platform
            let fileBlob;
            let uploadRes;
            if (Platform.OS === 'web') {
                fileBlob = await fetch(file.uri).then(res => res.blob());
                const data = {
                id : doc.id,
                file: fileBlob,
                }
                uploadRes = await addDocumentToBucketWeb(data);
                
            } else {
                
               fileBlob = {
                         uri: file.uri,
                         name: file.name,
                         type: file.mimeType || 'application/pdf',
                         size: file.size,
                };
                uploadRes = await addDocumentToBucket(
                    doc.id,
                    fileBlob,
                );
            }
           
            

            appwriteRes.uploaded = true;
            const final = await updateDocumentConfig(appwriteRes);
            setDocuments(prevDocuments => [...prevDocuments, final])
            setIsVisibleNewQuestion(false);
        } catch (error) {
            if (__DEV__) {
            console.log('Error in addDocument:', error);
            }
        } finally {
            setIsVisibleNewQuestion(false);
        }
    }
    /**
     * This function removes a document locally and deletes it from the Appwrite bucket.
     * @param {string} id - The ID of the document to update.
     */
    async function deleteDocument(id, type = "document") {
  try {
    if (type === "document") {
      setDocuments(documents.filter(document => document.$id !== id));
      removeDocumentConfig(id);
    } else if (type === "question") {
      const updatedQuestions = questions.filter(q => q.$id !== id);
      setQuestions(updatedQuestions);
        const parsedList = reverseToManyStringifyActions(module.questionList);
      const updatedQuestionList = parsedList.filter(q => q.id !== id);
      const res = await updateModuleData(module.$id, {
        questionList: updatedQuestionList.map(item => JSON.stringify(item)),
        questions: updatedQuestionList.length,
        progress: calculatePercent(updatedQuestions), // <- Hier ist der Fix
      });

      await removeQuestion(id);
    }
  } catch (error) {
    if (__DEV__) {
    console.log("❌ Fehler beim Löschen:", error);
    }
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
        const parsedQuestions = reverseToManyStringifyActions(module.questionList);
        const noDuplicates = parsedQuestions.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.id === item.id
            ))
        );

        
        


        if (noDuplicates.length !== module.questionList.length || module.questions !== noDuplicates.length) {
            const res = await updateModuleData(module.$id, {
                questionList: noDuplicates.map(item => JSON.stringify(item)),
                questions: noDuplicates.length,
                progress: calculatePercent(questions)
            });
        } 
    }

    updateQuestionList();
}, [questions]);

   useEffect(() => {
        setTab(1)
        setChange(change + 1)
   },[selectedSession])

   const [ questionToEdit, setQuestionToEdit ] = useState({
        $id: undefined,
        question: "",
        questionUrl: "",
        questionLatex: "",
        answers: [],
        answerIndex: [],
        tags: [],
        "public": false,
        sessionID: null,
        aiGenerated: false,
        subjectID: moduleEntry.$id,
        status: null,
        hint: "",
        explaination: ""

    });

    const [ isVisibleEditQuestion, setIsVisibleEditQuestion ] = useState({state:false, status: 0});
    const [ questionActive, setQuestionActive ] = useState(0);
    const [ answerActive, setAnswerActive ] = useState(0);
    const [ newQuestion, setNewQuestion ] = useState({
        $id: undefined,
        question: "",
        questionUrl: "",
        questionLatex: "",
        answers: [],
        answerIndex: [],
        tags: [],
        "public": false,
        sessionID: null,
        aiGenerated: false,
        subjectID: module.$id,
        status: null

   });
    return (
        <View className='flex-1 rounded-[10px] items-center '>
           
            <ModalNewQuestion setQuestionToEdit={setQuestionToEdit} setIsVisibleEditQuestion={setIsVisibleEditQuestion} isVisibleEditQuestion={isVisibleEditQuestion} documents={documents} texts={texts} selectedLanguage={selectedLanguage} SwichToEditNote={SwichToEditNote} addDocument={addDocument} sessions={sessions} selected={selectedSession} module={module} isVisible={isVisibleNewQuestion} setIsVisible={setIsVisibleNewQuestion} setSelected={setSelectedScreen} selectAi={()=> {setIsVisibleNewQuestion(false); setIsVisibleAI(true) } } /> 
            <AiQuestion setQuestionLoadedSessions={setQuestionLoadedSessions}
             module={module} setErrorMessage={setErrorMessage} setIsError={setIsError} uploadDocument={addDocument}
            sessions={sessions} setSessions={setSessions} documents={documents} questions={questions} setQuestions={setQuestions}
               selectedSession={sessions[selectedSession]} isVisible={isVisibleAI}
                setIsVisible={setIsVisibleAI} selectedModule={module} />
            {isVertical ? <View className=' h-[15px] w-[95%] bg-gray-900 bg-opacity-70 rounded-t-[10px]  opacity-50'></View> : null }
            <View className='flex-1 rounded-[10px] w-full bg-gray-900  border-gray-700 '>
                { loading ? <Text>...</Text> :
                <View className='flex-1'>
                <Header 
                    setIsVisibleEditQuestion={setIsVisibleEditQuestion}
                    moduleID={module.$id}
                    moduleName={module.name} texts={texts} selectedLanguage={selectedLanguage} isVisibleAI={isVisibleAI} setIsVisibleAI={setIsVisibleAI}
                    isVisibleNewQuestion={isVisibleNewQuestion} setIsVisibleNewQuestion={setIsVisibleNewQuestion} moduleSessions={sessions}
                    questions={questions} setQuestions={setQuestions} addDocument={addDocument} setSelectedScreen={setSelectedScreen}
                    selectedModule={module} selected={selectedSession} sessions={sessions}  setSessions={setSessions}
                    modules={modules}
                    setModules={setModules}
                    setSelectedModule={setSelectedScreen}
                    setIsError={setIsError}
                    setErrorMessage={setErrorMessage}
                    moduleDescription={module.description}
                    
                    />
                {!isVertical ? <SwichTab tabWidth={tabWidth} setTab={setTab} tab={tab} tab1={"Map"} tab2={"Fragen"} bg={"bg-gray-900"} change={change}/> : null }
                <View className={`border-t-[1px] border-gray-600 ${isVertical ? "mt-3" : null}`}/>
                
                <View className={`flex-1 ${isVertical ? "flex-row" : null}`}>
                        { 
                            tab == 0 ?
                            
                            <View className='h-full flex-1 border-gray-600 border-l-[1px] p-4 max-w-[500px]'>
                                <RoadMap  moduleID={moduleEntry.$id} texts={texts} selectedLanguage={selectedLanguage} change={change} setChange={setChange} setTab={setTab} moduleSessions={sessions} selected={selectedSession} setSelected={setSelectedSession} questions={questions} currentModule={module}/> 
                            </View>
                            : null
                        }
                        {isVertical || tab == 1 ?
                            <View className='p-4 flex-1'>
                                <Data  setQuestionToEdit={setQuestionToEdit} isVisibleEditQuestion={isVisibleEditQuestion} setIsVisibleEditQuestion={setIsVisibleEditQuestion} setIsVisibleNewQuestion={setIsVisibleNewQuestion} setSelectedScreen={setSelectedScreen} refreshing={refreshing} onRefresh={onRefresh}  texts={texts} selectedLanguage={selectedLanguage} SwichToEditNote={SwichToEditNote} setSelected={setSelectedScreen} setIsVisibleAI={setIsVisibleAI} addDocument={addDocument} deleteDocument={deleteDocument} moduleSessions={sessions} selected={selectedSession} questions={questions} notes={notes} documents={documents} module={module}/>
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
            {/*}
            { isVisibleEditQuestion.state ?
            <ChangeQuestions
                question={questionToEdit}
                questions={questions}
                setQuestions={setQuestions}
                module={module}
                setModule={setModule}
                selectedSession={sessions[selectedSession]}
                isVisibleEditQuestion={isVisibleEditQuestion}
                setIsVisibleEditQuestion={setIsVisibleEditQuestion}

    />      : null}
    */}
        </View>
    )
}

export default SingleModule