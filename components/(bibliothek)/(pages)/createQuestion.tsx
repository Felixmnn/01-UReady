import { View, Text, TouchableOpacity, FlatList,TextInput } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions } from 'react-native';
import { useState,useEffect } from 'react';
import { loadQuestions } from '@/lib/appwriteDaten';
import ToggleSwitch from '@/components/(general)/toggleSwich';
import { setNativeProps } from 'react-native-reanimated';
import { updateDocument } from '@/lib/appwriteEdit';

const CreateQuestion = ({setSelected2,module, selectedModule}) => {
    const { width,height } = useWindowDimensions();
    const isVertical = width > 700;
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState([])
    const [selectedQuestion, setSelectedQuestion] = useState(0)
    const [ungespeichert, setUngespeichert] = useState(true)
    
        useEffect(() => { 
            async function fetchQuestions() {
                const questions = await loadQuestions()
                if (questions) {
                    const questionArray = questions.documents
                    const filteredQuestions = questionArray.filter((question) => question.subjectID == module.documents[selectedModule].$id);
                    setQuestions(filteredQuestions)  
                }  
            }
            fetchQuestions()
            setLoading(false)
        }, [])
        const Header = () => {
            return (
            <View className='flex-row justify-between items-center p-3 bg-gray-800  w-full rounded-t-[10px]'>
                <View className='flex-row items-center'>
                    <TouchableOpacity onPress={()=> setSelected2("SingleModule") }>
                        <Icon name="arrow-left" size={20} color="white"/>
                    </TouchableOpacity>
                    <View className='items-start justify-center ml-3'>
                        <Text className='text-white font-bold'>Quiz Frage für "{module.documents[selectedModule].name}" erstellen</Text>
                        <Text className='text-gray-500 text-[12px]'> {ungespeichert? "Ungespeicherte Änderungen " : "Alle änderungen gespeichert"}</Text>
                    </View>
                </View>
                <View className='flex-row bg-gradient-to-b from-[#2b3d69] to-blue-500 items-center justify-center px-2 py-1 rounded-full'>
                    <Icon name="microchip" size={15} color="white"/>
                    <Text className='text-white ml-2'>Mit AI generieren</Text>
                </View>
            </View>
            )
        }    

        const Questions = () => {
        const [currentQuestion,setCurrentQuestion]  = useState({
            question:null,
            answers:[]
        })
        return (
            <View className={` border-r-[1px] border-gray-500`} 
            style={{height:height-100}}
                >
                <FlatList
                    data={questions}
                    keyExtractor={(item)=> item.question}
                    style={{
                        scrollbarWidth: 'thin', // Dünne Scrollbar
                        scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
                      }}
                    ListHeaderComponent={()=> {
                        return (
                            <View>
                                <TouchableOpacity className={`bg-white mx-2 mt-4 mb-2 rounded-full p-2 items-center justify-center`}>
                                    <Text className='font-semibold'>+Neue Karteikarte</Text>
                                </TouchableOpacity>
                               <TouchableOpacity onPress={()=> setSelectedQuestion(0)} className={`mx-3 my-2 w-[180px] h-[100px] bg-gray-800 rounded-[10px] ${selectedQuestion  == 0   ? "border-blue-700" : "border-gray-500"} border-[1px] p-1 items-center justify-center`}>
                                    <Text className='text-white text-center text-[10px]'>{currentQuestion.question}</Text>
                                    <View className='w-full border-t-[1px] border-gray-500 my-2'/>
                                    <Text className='text-white text-[10px]'>{currentQuestion.answers[0]}</Text>
                                </TouchableOpacity> 
                            </View>
                        )
                    }}
                    renderItem={({ item,index }) => {
                        return (
                            <TouchableOpacity onPress={()=> setSelectedQuestion(index + 1)} className={`mx-3 my-2 w-[180px] h-[100px] bg-gray-800 rounded-[10px] ${selectedQuestion  == index +1   ? "border-blue-700" : "border-gray-500"} border-[1px] p-1 items-center justify-center`}>
                                <Text className='text-white text-center text-[10px]'>{item.question}</Text>
                                <View className='w-full border-t-[1px] border-gray-500 my-2'/>
                                <Text className='text-white text-[10px]'>{item.answers[0]}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        )
        }
        useEffect(()=> {
            console.log("Changes where made")
            async function push(){
            await updateDocument(questions[selectedQuestion-1])
            }
            push()
            setUngespeichert(false)
        },[questions, setQuestions])
        
        const [questionActive, setQuestionActive] = useState(false)
        const [answerActive, setAsnwerActive] = useState(null)
    const EditQuestions = () => {
        const EditQuestion = ()=> {
            const [newText, setNewText] = useState(questions[selectedQuestion-1].question)
            function saveChange (){
                setQuestions(prevQuestions =>
                    prevQuestions.map((question, i) =>
                        i === selectedQuestion-1 ? { ...question, question: newText } : question
                    )
                ) 
            }
            function handleChange (change){
                setNewText(change)
            }
            return (
                <View className='w-full p-4 items-center justify-center'>
                    {
                        questionActive ?
                        <TouchableOpacity className={`w-full bg-[#0c111d] rounded-[10px] border-[1px] p-2 ${true ? "border-blue-700" : "border-gray-500"}`}>
                            <TextInput
                            value={newText}
                            style={{borderColor:"transparent", borderWidth:0}}
                            className='text-white w-full rounded-[10px] p-1'
                            onBlur={() => {
                                if (newText !== questions[selectedQuestion - 1]?.question) {
                                    saveChange();
                                }
                                setQuestionActive(false)
                            }}
                            onChangeText={handleChange}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={()=>setQuestionActive(true)} className='w-full'>
                            <Text className='text-[15px] font-bold text-gray-400'>Frage:</Text>
                            <Text className='text-gray-300 font-bold m-2'>{questions[selectedQuestion-1].question}</Text>
                        </TouchableOpacity>
                    }
                </View>
            )
        }

        const EditAnswers = ()=> {
                const RenderAnswer = ({index}) => {
                    const [isOn, setIsOn] = useState(false)
                    const [newText, setNewText] = useState(questions[selectedQuestion-1].answers[answerActive])
                    function handleChange (change){
                        setNewText(change)
                    }
                    function saveChange( ) {
                        setQuestions(prevQuestions =>
                            prevQuestions.map((question, i) =>
                                i === selectedQuestion - 1
                                    ? { 
                                        ...question, 
                                        answers: question.answers.map((answer, j) =>
                                            j === answerActive ? newText : answer
                                        ) 
                                    }
                                    : question
                            )
                        );
                    }
                    function toggleIndex(index) {
                        setQuestions(prevQuestions =>
                            prevQuestions.map((question, i) =>
                                i === selectedQuestion - 1
                                    ? { 
                                        ...question, 
                                        answerIndex: question.answerIndex.includes(index)
                                            ? question.answerIndex.filter(idx => idx !== index) // Entfernen
                                            : [...question.answerIndex, index] // Hinzufügen
                                    }
                                    : question
                            )
                        );
                    }
                    return (
                        <View className={`w-full rounded-[10px] p-2 ${questions[selectedQuestion-1].answerIndex.includes(index)? "bg-green-900" : "bg-red-900"}`}>
                            <View className='flex-row justify-between'>
                            <View className='flex-row items-center'>
                                { questions[selectedQuestion-1].answerIndex.includes(index)?
                                    <Text className='text-green-300 font-bold mr-2'>Richtige Antwort</Text>
                                    :
                                    <Text className='text-red-300 font-bold mr-2'>Falsche Antwort</Text>
                                }
                                <ToggleSwitch isOn={questions[selectedQuestion-1].answerIndex.includes(index)} onToggle={()=> {{
                                    if (!isOn){
                                        toggleIndex(index)
                                    } 
                                    setIsOn(!isOn);
                                    }}}/>
                            </View>
                            <View>
                                {
                                    questions[selectedQuestion-1].answerIndex.includes(index) ?
                                    null:
                                    <TouchableOpacity>
                                        <Icon name="times"  size={20} color="white"/>
                                    </TouchableOpacity> 
                                }
                            </View>
                            </View>
                            <TouchableOpacity onPress={()=> {
                                if (questionActive){
                                    setQuestionActive(false)
                                }
                                setAsnwerActive(index)
                            }}>
                                {   answerActive == index ?
                                    <TextInput
                                    value={newText}
                                    style={{borderColor:"transparent", borderWidth:0}}
                                    className='text-white w-full rounded-[10px] p-1'
                                    onBlur={() => {
                                        if (newText !== questions[selectedQuestion - 1]?.question) {
                                            saveChange();
                                        }
                                        setQuestionActive(false)
                                    }}
                                    onChangeText={handleChange}
                                    />
                                    :
                                    <Text className='text-gray-300 font-bold m-2 '>{questions[selectedQuestion-1].answers[index]}</Text>

                                }
                            </TouchableOpacity>
                        </View>
                    )
                }
                return (
                    <View className='items-center justify-center w-full'>
                        {
                            questions[selectedQuestion-1].answers.map((answer,index)=>{
                                return (
                                    <View key={index} className='w-full m-1'>
                                        <RenderAnswer index={index}/>
                                        
                                    </View>
                                )
                            })
                        }  
                        <View className='p-1 w-full  justify-start'>
                            <View className='flex-row items-center justify-center px-1 py-1 rounded-full border-gray-500 border-[1px] w-[170px]'>
                                <Icon name="plus" size={10} color="white"/>
                                <Text className='text-[12px] ml-2 text-gray-300 font-semibold '>
                                    Antwort hinzufügen
                                </Text>
                            </View>
                            
                        </View>  
                    </View>
                )
            }
            return (
                <View className='flex-1 items-center justify-center p-4'>
                <View className='w-full bg-gray-800 border-gray-700 border-[1px] p-4 rounded-[10px]'>
                    <View className='flex-row justify-between'>
                        <View>
                            {
                                selectedQuestion !== 0 && questions[selectedQuestion-1].tags.length > 0 ?
                                <View>
                                </View>
                                :
                                <TouchableOpacity className='flex-row items-center px-2 py-1 border-[1px] border-gray-500'>
                                    <Icon name="plus" size={15} color="white"/>
                                    <Text className='text-white font-bold ml-2 text-[12px]'>Tags hinzufügen</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <TouchableOpacity>
                            <Icon name="ellipsis-v" size={15} color="white"/>
                        </TouchableOpacity>
                    </View>
                    {
                        selectedQuestion == 0 ?
                        <View>
                            <Text>

                            </Text>
                        </View>
                        :
                    <View className='flex-1 justify-center items-center'>
                            <EditQuestion/>
                                <View className='border-t-[1px] border-gray-500 w-full my-2'/>
                            <EditAnswers/>
                    </View>
                    }
                </View>
                </View>

            )
        }
        
  return (
    <View className='flex-1 items-center '>
        {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }
        {
            questions.length > 0 ?
            <View className=' w-full bg-gray-900 rounded-[10px] border-gray-700 border-[1px]'>
                <Header/>
                <View className='w-full flex-row'>
                    <Questions/>
                    <EditQuestions/>
                </View>
            </View>
        :
            <Text className='text-white'>Stelle dir einen Skeleton view vor</Text>
        }
    </View>
  )
}

export default CreateQuestion