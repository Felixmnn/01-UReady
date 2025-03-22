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
import { loadNotes, loadQuestions } from '@/lib/appwriteDaten';
import { updateModule } from '@/lib/appwriteEdit';

const SingleModule = ({setSelectedScreen, module}) => {
    const { width } = useWindowDimensions();
    const tabWidth = width / 2;
    const [selectedSession, setSelectedSession] = useState(0)
    const [ tab, setTab ] = useState(0)
    const isVertical = width > 700;
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [notes, setNotes] = useState([]);
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
        async function fetchQuestions() {
            const questions = await loadQuestions();
            const notes = await loadNotes();
            if (questions) {
                const questionArray = questions.documents
                const filteredQuestions = questionArray.filter((question) => question.subjectID == module.$id);
                setQuestions(filteredQuestions)  
            }  
            if (notes) {
                const noteArray = notes.documents
                console.log("Note Array ist hier:",noteArray)
                const filteredNotes = noteArray.filter((note) => note.subjectID == module.$id);
                setNotes(filteredNotes)  
            }
        }
        fetchQuestions()
        setLoading(false) 
    }, [])
    
    return (
        <View className='flex-1 items-center '>
            
            {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }
            <View className='flex-1 w-full bg-gray-900 rounded-[10px] border-gray-700 border-[1px]'>
                { loading ? <Text>Skeleton View</Text> :
                <View className='flex-1'>
                <Header setSelectedScreen={setSelectedScreen} selectedModule={module} selected={selectedSession} sessions={sessions}  setSessions={setSessions}/>
                {!isVertical ? <SwichTab tabWidth={tabWidth} setTab={setTab} tab1={"Fragen"} tab2={"Roadmap"} bg={"bg-gray-900"}/> : null }
                <View className={`border-t-[1px] border-gray-600 ${isVertical ? "mt-3" : null}`}/>
                <View className='flex-1 flex-row'>
                    <View className='p-4 flex-1'>
                        { 
                            tab == 0 ?
                            <Data moduleSessions={sessions} selected={selectedSession} questions={questions} notes={notes}/>
                            : null
                        }
                    </View>
                    {isVertical || tab == 1 ?
                    <View className='h-full border-gray-600 border-l-[1px] p-4 items-center'>
                       <RoadMap moduleSessions={sessions} selected={selectedSession} setSelected={setSelectedSession} questions={questions}/> 
                    </View>
                    : null }
                </View>
                </View>
                }   
            </View>       
        </View>
    )
}

export default SingleModule