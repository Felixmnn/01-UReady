import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome5'
import ToggleSwitch from '@/components/(general)/toggleSwich';
import 'katex/dist/katex.min.css';

import { BlockMath } from 'react-katex';
import { addQUestion, updateDocument } from '@/lib/appwriteEdit';



const ChangeQuestions = ({
    question,
    questions,
    setQuestions,
    module,
    setModule,
    selectedSession,
    isVisibleEditQuestion,
    setIsVisibleEditQuestion
}) => {
    const [questionToEdit, setQuestionToEdit] = useState({
        ...question,
        answers: question.answers.map((a) => {
            try {
            const parsed = JSON.parse(a);
            if (parsed.title !== undefined) {
                return parsed;
            }
            } catch (error) {
            }
            return {
            title: a,
            latex: null,
            image: null,
            };
        }),
        });

    console.log("ChangeQuestions questionToEdit", questionToEdit);
    const sheetRef = useRef<BottomSheet>(null);
    const [ isOpen, setIsOpen ] = useState(true);
    const snapPoints = ["40%","60%","90%"];     

    function validateNewQuestion() {
        if (questionToEdit.question === "") {
            alert("Bitte eine Frage eingeben.");
            return false;
        }
        if (questionToEdit.answers.length === 0) {
            alert("Bitte mindestens eine Antwort hinzufügen.");
            return false;
        }
        const hasCorrectAnswer = questionToEdit.answerIndex.length > 0;
        if (!hasCorrectAnswer) {
            alert("Bitte mindestens eine Antwort als richtig markieren.");
            return false;
        }
        return true;

    }
    useEffect(() => {
        setIsOpen(true);
        sheetRef.current?.snapToIndex(0);
    }, [ isVisibleEditQuestion])
    
    const ContentInput = ({questionToEdit, setQuestionToEdit,itemIndex=0, title="", dataTmp="text", latexTmp="", imageTmp="", correctAnswerTmp=false,  typeOfQuestion=false}) => {
        const [ text, setText] = useState(title);
        const [ detailsHidden, setDetailsHidden ] = useState(true);
        const [ textVisible, setTextVisible ] = useState(true);
        const [ dataType, setDataType ] = useState(dataTmp);
        const [ latex, setLatex ] = useState(latexTmp);
        const [ urlImage, setUrlImage ] = useState(imageTmp);
        const [ imageValid, setImageValid ] = useState(true);
        const [ correctAnswer, setCorrectAnswer ] = useState(correctAnswerTmp);
        console.log("Data Type", dataType)

        const Selectable = ({name="font", handlePress=()=> {}, title="Text", isSelected=false }) => {
            return (
                <TouchableOpacity 
                    className='flex-row items-center justify-center rounded-full h-8 px-3'
                    style={{ backgroundColor: isSelected ? '#3B82F6' : null}}
                    onPress={handlePress}
                >
                    <Icon name={name} size={15} color="white" />
                    {isSelected ? <Text className='text-white font-semibold ml-2 mb-[1px]'>{title}</Text> : null}
                </TouchableOpacity>
            )
        }
        const isImageUrl = (url) => {
            return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/.test(url.toLowerCase());
        };
        return (
            <View className='w-full px-4 py-2 '>
               
                {
                    detailsHidden ?
                    <TouchableOpacity className={`w-full items-center justify-between ${typeOfQuestion ? "bg-gray-800" : correctAnswer ? "bg-green-900" : "bg-red-900"} rounded-lg`} onPress={() => setDetailsHidden(false)}>
                        <Text className='text-white text-[15px] text-center font-semibold'
                        style={{
                            paddingTop : 10,
                            paddingBottom: dataType !== "text" ? 0 : 10,
                        }}
                        >
                            {text ? text : "Gebe deine Frage ein..."}
                        </Text>
                        {
                        dataType === "latex"  ?
                        <View className=' w-full   rounded-lg  overflow-hidden '>
                            <BlockMath
                                    math={latex}
                                      className="text-white"
                                    
                                    style={{ color:"white", text:"white", fontSize: 20 }}
                            />
                        </View>
                        : dataType === "image"   ?
                        <View className='w-full  rounded-lg overflow-hidden min-h-10 p-2 items-center'>
                            { imageValid ?
                            <Image
                                source={{ uri: urlImage }}
                                style={{ width:"100%" , height:150, borderRadius: 10,  }}
                                resizeMode="contain"
                                onError={() => setImageValid(false)}
                                onLoad={() => setImageValid(true)}
                            />
                            :
                            <Text className='text-red-500 mt-2'>Ungültige Bild-URL {urlImage}</Text>
                            }
                        </View>
                        : null
                    }
                    </TouchableOpacity>
                :
                <View className={`flex-col w-full items-start justify-between ${typeOfQuestion ? "bg-gray-800" : correctAnswer ? "bg-green-900" : "bg-red-900"} rounded-lg px-4 py-2`}>
                <View className='w-full items-center  max-h-60 mb-2'>
                <TextInput
                    className={`flex-1 w-full bg-gray-900  text-white rounded-lg p-2`}
                    placeholder='Frage eingeben...'
                    value={text}
                    onChangeText={(text) => setText(text)}  
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={2}
                    style={{ minHeight: 40, maxHeight: 40, textAlignVertical: 'top' }}
                />
                <View className='flex-1 flex-row w-full justify-between items-center'
                    
                > 
                    {
                        textVisible && (dataType == "latex" || dataType == "image") ?
                        <TextInput
                            className='flex-1 w-full bg-gray-900 p-2 text-white rounded-lg mt-2'
                            placeholder={dataType === "latex" ? "LaTeX eingeben..." : "Bild-URL eingeben..."}
                            value={dataType === "latex" ? latex : urlImage}
                            onChangeText={(text) => {
                                if (dataType === "latex") {
                                    setLatex(text);
                                } else if (dataType === "image") {
                                    setImageValid(isImageUrl(text));
                                    setUrlImage(text);
                                }
                            }}  
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={5}
                            style={{ minHeight: 80, maxHeight: 80, textAlignVertical: 'top' }}
                        />
                        : null
                    }
                    {
                        dataType === "latex" && !textVisible ?
                        <View className='bg-gray-900 w-full mt-2  rounded-lg overflow-hidden min-h-10'>
                            <BlockMath
                                    math={latex}
                                      className="text-white"
                                    
                                    style={{ color:"white", text:"white", fontSize: 20, marginTop: 10 }}
                            />
                        </View>
                        : dataType === "image" && !textVisible    ?
                        <View className='bg-gray-900 w-full mt-2 rounded-lg overflow-hidden min-h-10 p-2 items-center'>
                            { imageValid ?
                            <Image
                                source={{ uri: urlImage }}
                                style={{ width:"100%" , height:150, borderRadius: 10,  }}
                                resizeMode="contain"
                                onError={() => setImageValid(false)}
                                onLoad={() => setImageValid(true)}
                            />
                            :
                            <Text className='text-red-500 mt-2'>Ungültige Bild-URL</Text>
                            }
                        </View>
                        : null
                    }

                </View> 
                </View>

                <View className='w-full  flex-row items-center justify-between'>
                    <View className='flex-row items-center space-x-2'>
                    <View className='flex-row items-center bg-gray-900 rounded-full h-8 '>
                        <Selectable
                            name="font"
                            title="Text"
                            isSelected={dataType === "text"}
                            handlePress={() => setDataType("text")}
                        />
                        <Selectable
                            name="code"
                            title="LaTeX"
                            isSelected={dataType === "latex"}
                            handlePress={() => setDataType("latex")}
                        />
                        <Selectable
                            name="image"
                            title="Bild"
                            isSelected={dataType === "image"}
                            handlePress={() => setDataType("image")}    
                        />
                    </View>
                    { dataType !== "text"  ?
                        <Icon 
                            name={textVisible ? "eye" : "eye-slash"}
                            size={20}
                            color="white"
                            onPress={() => setTextVisible(!textVisible)}
                            style={{ padding:10 }}
                        />
                    :null}
                    </View>
                    <View className='flex-row items-center'>
                        <Icon
                            name="trash"
                            size={20}
                            color="red"
                            style={{ marginRight: 10, padding: 10 }}
                            onPress={() => {
                                if (typeOfQuestion) {
                                    console.log("Delete question", questionToEdit);
                                } else {
                                    const updatedAnswers = [...questionToEdit.answers];
                                    updatedAnswers.splice(itemIndex, 1);
                                    setQuestionToEdit({
                                        ...questionToEdit,
                                        answers: updatedAnswers
                                    });
                                }
                                setDetailsHidden(true);
                            }}
                            />
                        {!typeOfQuestion &&
                        <ToggleSwitch
                            onToggle={()=> setCorrectAnswer(!correctAnswer)}
                            isOn={correctAnswer}
                        />
                        }
                        <TouchableOpacity onPress={()=> {
                            if (typeOfQuestion){
                                setImageValid(isImageUrl(urlImage));
                                setQuestionToEdit({
                                    ...questionToEdit,
                                    question: text,
                                    questionLatex: latex,
                                    questionUrl: urlImage,
                                })
                            } else {
                                const updatedAnswers = [...questionToEdit.answers];
                                updatedAnswers[itemIndex] = {
                                    title: text,
                                    latex: latex,
                                    image: urlImage,
                                };
                                setQuestionToEdit({
                                    ...questionToEdit,
                                    answers: updatedAnswers,
                                    answerIndex: correctAnswer ? [...questionToEdit.answerIndex, itemIndex] : questionToEdit.answerIndex.filter((index) => index !== itemIndex)
                                });
                            }
                            setDetailsHidden(true)

                            }} className='bg-blue-500 ml-2 rounded-lg h-6 w-6 items-center justify-center '>
                            <Icon 
                                name="check"
                                size={15}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                </View>
                </View>
                }
            </View>
        )
    }

  return (
     <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => {setIsOpen(false)}}
        backgroundStyle={{ backgroundColor: '#1F2937',
           
         }} 
        >
        <BottomSheetScrollView
        contentContainerStyle={{ backgroundColor: '#111827', paddingBottom: 40 }}
        style={{ backgroundColor: '#111827' }}
        className={"bg-gray-900 "}
        showsVerticalScrollIndicator={false}>
            <View className='flex-1 h-full items-center justify-center p-4'>
                <View className='flex-row items-center justify-between w-full mb-4'> 
                    <TouchableOpacity className='p-2'>
                        <Icon 
                            name="ellipsis-v"
                            size={15}
                            color="#fff"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity className='px-3 py-1 bg-blue-500 rounded-full'
                        onPress={async() => {
                            console.log("Save question", questionToEdit, selectedSession);
                            if (validateNewQuestion()){
                                //Modul Conifg
                                //Question Locally
                                //Question In Database
                                if (questionToEdit?.$id === undefined) {
                                   const res = await addQUestion({
                                     ...questionToEdit,
                                     answers: questionToEdit.answers.map((a) => JSON.stringify(a)),
                                    subjectID: module.$id,
                                    sessionID: selectedSession.id,
                                   })
                                   console.log("New question added", res);
                                   setQuestions([...questions, res])
                                   setModule({
                                    ...module,
                                    questionList: [...module.questionList, {id:res.$id, status: null}]
                                   })
                                   setQuestionToEdit({
                                    $id: undefined,
                                    question: "",
                                    questionUrl: "",
                                    questionLatex: "",
                                    answers: [],
                                    answerIndex: [],
                                    subjectID: module.$id,
                                    sessionID: selectedSession.id,
                                   });
                                } else {
                                    const res = await updateDocument({
                                        ...questionToEdit,
                                        answers: questionToEdit.answers.map((a) => JSON.stringify(a)),
                                    })
                                    console.log("Question updated", res);
                                    const updatedQuestions = questions.map((q) => {
                                    if (q.$id === questionToEdit.$id) {
                                        return {
                                            ...questionToEdit,
                                            answers: questionToEdit.answers.map((a) => JSON.stringify(a)),
                                            question: questionToEdit.question,
                                            questionUrl: questionToEdit.questionUrl,
                                            questionLatex: questionToEdit.questionLatex,
                                        };
                                    }
                                    return q;
                                });
                                setQuestions(updatedQuestions);
                                }
                                
                                setIsVisibleEditQuestion({
                                    state: false,
                                    status: isVisibleEditQuestion
                                });
                            }
                        }}
                    >
                        <Text className='text-white text-[15px] font-semibold'>
                            Speichern
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className='w-full p-4 mb-4'>
                    <Text className='text-white text-[17px] font-semibold'>
                        Frage bearbeiten
                    </Text>
                    <ContentInput 
                        typeOfQuestion={true}
                        title={questionToEdit.question}
                        dataTmp={questionToEdit.questionLatex == null  || questionToEdit.questionLatex.length == 0 ? questionToEdit.questionUrl == null || questionToEdit.questionUrl.length == 0? "text" : "image" : "latex" }   
                        latexTmp={questionToEdit.questionLatex}
                        imageTmp={questionToEdit.questionUrl}
                        correctAnswerTmp={false}
                        questionToEdit={questionToEdit}
                        setQuestionToEdit={setQuestionToEdit}

                    />
                </View>
                <View className='w-full px-4 h-[2px] bg-gray-900'/>
                <View className='w-full p-4 mb-4'>
                    <Text className='text-white text-[16px] font-semibold mb-2'>
                        Antworten
                    </Text>
                    {questionToEdit.answers.map((q, index) => (
                        <ContentInput 
                            key={index}
                            title={q.title}
                            dataTmp={q.latex == null || q.latex.length == 0 ? q.image == null || q.image.length == 0 ? "text" : "image" : "latex" }   
                            latexTmp={q.latex}
                            imageTmp={q.image}
                            correctAnswerTmp={questionToEdit.answerIndex.includes(index)}
                            questionToEdit={questionToEdit}
                            setQuestionToEdit={setQuestionToEdit}
                            typeOfQuestion={false}
                            itemIndex={index}
                        />
                    ))}
                        <TouchableOpacity onPress={()=> {
                            const newAnswer = {
                                title: "",
                                latex: "",
                                image: "",
                            };
                            setQuestionToEdit({
                                ...questionToEdit,
                                answers: questionToEdit.answers.length > 0 ? [...questionToEdit.answers, newAnswer] : [newAnswer]
                            });
                        }} className='w-full bg-gray-800 rounded-lg p-2 items-center mt-2'>
                            <Text className='text-white text-[15px] font-semibold'>
                                Neue Antwort hinzufügen
                            </Text>
                        </TouchableOpacity>
                        <TextInput
                            className='w-full bg-gray-900 text-white rounded-lg p-2 mt-2'
                            placeholder='Gebe hier eine Antwort ein...'
                            value={questionToEdit.explaination}
                            
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={2}
                            style={{ minHeight: 40, maxHeight: 40, textAlignVertical: 'top' }}
                        />
                    
                </View>

            </View>
        </BottomSheetScrollView>
    </BottomSheet>
  )
}

export default ChangeQuestions