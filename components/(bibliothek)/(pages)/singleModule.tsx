import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import SessionProgress from '../sessionProgress';
import RoadMap from '../(sections)/roadMap';
import Data from '../(sections)/data';
import Header from '../(sections)/header';
import { quizQuestion } from '@/assets/exapleData/quizQuestion';
import SwichTab from '../../(tabs)/swichTab';
import { loadDocuments, loadNotes, loadQuestions } from '@/lib/appwriteDaten';
import { addDocumentConfig, addDocumentToBucket, removeDocumentConfig, updateDocumentConfig, updateModule } from '@/lib/appwriteEdit';
import uuid from 'react-native-uuid';
import * as DocumentPicker from 'expo-document-picker';
import { getModuleAmout, getQuestions } from '@/lib/appwriteQuerys';
import { updateModuleData } from '@/lib/appwriteUpdate';

const SingleModule = ({setSelectedScreen, module}) => {
    const { width } = useWindowDimensions();
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
    console.log("Sessions:",sessions)

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
            console.log("Module Amout 🐋:",res);
            const resToRes = await updateModuleData(module.$id,{"questions":res?.questions,"notes":res?.notes})
            console.log("Module Amout Update 🐋:",resToRes);
        }
    
        fetchQuestions()
    }
    , [module])
    
      
      
    useEffect(() => { 
        if ( sessions == undefined  ) return;
        async function fetchQuestions() {
            const questions = await getQuestions(sessions[selectedSession].id);
            console.log("🔷 Fragen zur Session wurden erfolgreich geladen:",questions)
            //const notes = await loadNotes();
            //const documents = await loadDocuments();
            if (questions) {
                setQuestions((prevQuestions) => [...prevQuestions, ...questions.documents]);  
            }
            /*
            if (notes) {
                const noteArray = notes.documents
                console.log("Note Array ist hier:",noteArray)
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
        fetchQuestions()
        setLoading(false) 
    }, [sessions, selectedSession])


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
                console.log("Appwrite Response",appwriteRes);
            }
            //Step 3 - Upload the Document
            const fileBlob = await fetch(file.uri).then(res => res.blob());
            const data = {
                fileID: doc.id,
                fileBlob: fileBlob,
            }
            const uploadRes = await addDocumentToBucket(data);
            console.log("Upload Response",uploadRes);
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

    return (
        <View className='flex-1 items-center '>
            
            {isVertical ? <View className=' h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }
            <View className='flex-1 w-full bg-gray-900  border-gray-700 '>
                { loading ? <Text>Skeleton View</Text> :
                <View className='flex-1'>
                <Header questions={questions} setQuestions={setQuestions} addDocument={addDocument} setSelectedScreen={setSelectedScreen} selectedModule={module} selected={selectedSession} sessions={sessions}  setSessions={setSessions}/>
                {!isVertical ? <SwichTab tabWidth={tabWidth} setTab={setTab} tab={tab} tab1={"Fragen"} tab2={"Navigation"} bg={"bg-gray-900"}/> : null }
                <View className={`border-t-[1px] border-gray-600 ${isVertical ? "mt-3" : null}`}/>
                
                <View className={`flex-1 ${isVertical ? "flex-row" : null}`}>
                        { 
                            tab == 0 ?
                            <View className='p-4 flex-1'>
                                <Data addDocument={addDocument} deleteDocument={deleteDocument} moduleSessions={sessions} selected={selectedSession} questions={questions} notes={notes} documents={documents}/>
                            </View>
                            : null
                        }
                        {isVertical || tab == 1 ?
                            <View className='h-full flex-1 border-gray-600 border-l-[1px] p-4 max-w-[700px]'>
                                <RoadMap setTab={setTab} moduleSessions={sessions} selected={selectedSession} setSelected={setSelectedSession} questions={questions}/> 
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