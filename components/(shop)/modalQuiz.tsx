import { View, Text, Modal, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import ChoiceQuestion from './(survey)/choiceQuestion';
import NumericQuestion from './(survey)/numericQuestion';
import RatingQuestion from './(survey)/ratingQuestion';
import SliderQuestion from './(survey)/sliderQuestion';
import TextQuestion from './(survey)/textQuestion';
import { loadQuestions } from '@/lib/appwriteDaten';
import IconPicker from '../(general)/iconPicker';
import Icon from 'react-native-vector-icons/FontAwesome5'   
import Questions from '../(bibliothek)/(pages)/(createQuestion)/questions';

const ModalQuiz = ({isVisible, setIsVisible, onComplete, texts, quiz}) => {
  console.log("Quiz Modal", quiz)
  const { width } = useWindowDimensions();
  

    const [exampleQuestions, setExampleQuestions] = useState([]);
    const [ answers, setAnswers] = useState([])
    const [initialValues, setInitialValues ] = useState([])
useEffect(()=> {
    if (!quiz) return;
    async function fetchQuestions(){
      const res = await loadQuestions(quiz.questions)
      console.log("Loaded Questions", res)
      setExampleQuestions(res)
      const mppedanswers = res?.reduce((acc, i) => {
      let emptyAnswer;

      switch (i.type) {
        case "SINGLECHOICE":
          emptyAnswer = null;
          break;
        case "MULTIPLECHOICE":
          emptyAnswer = [];
          break;
        case "USERINPUT":
        case "TEXT":      // falls TEXT synonym ist
          emptyAnswer = "";
          break;
        case "RATING":
        case "SLIDER":
        case "NUMBERINPUT":
          emptyAnswer = 0;
          break;
        case "YESNO":
          emptyAnswer = false;
          break;
        default:
          emptyAnswer = null; // Fallback
      }

      acc[i.$id.toString()] = emptyAnswer;

      return acc;
    }, {});

    setAnswers(mppedanswers);
    setInitialValues(mppedanswers)

    }
    fetchQuestions()
  },[quiz])

  const widthMax = width > 600 ? 600 : width - 60; // Max width for the modal
  const widthEachCompartment = (widthMax - exampleQuestions?.length * 10) / exampleQuestions?.length;

  const [ selectedQuestion, setSelectedQuestion ] = useState(0);
  

  
  return (
    <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        >
          <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
            { exampleQuestions?.length > 0 ?
            <View className=' p-4 rounded-lg bg-gray-800 '>
              {/* Status Bar */}
              <View className='flex-row w-full items-center px-2'>
              <View className='flex-1 flex-row items-center bg-gray-900'style={{height: 16,borderRadius: 8}}>
                {
                  exampleQuestions?.map((i,index)=> {
                    return (
                      <View key={index}  style={{width:widthEachCompartment, marginHorizontal: 6, height:8, backgroundColor: index <= selectedQuestion ? "#3B82F6" : "#CBD5E1", borderRadius:4}}/>
                    )
                  })
                }
              </View>
              <TouchableOpacity className='items-center justify-center p-2' onPress={()=> setIsVisible(false)}>
              <Icon name="times"  
                    size={25} 
                    color={"white"} />
              </TouchableOpacity>
              </View>

              
              <View className='items-center justify-center'>
                {
                  exampleQuestions[selectedQuestion].type === "SINGLECHOICE"
                  ? <ChoiceQuestion 
                      texts={texts}
                      multiselect={false} 
                      question={exampleQuestions[selectedQuestion].question} 
                      answers={exampleQuestions[selectedQuestion].answers} 
                      randomizeAnswers={exampleQuestions[selectedQuestion].randomizeAnswers}
                      maxSelection={1}
                      minSelection={1}
                      userAnswers={answers}
                      setUserAnswers={setAnswers}
                      questionId={exampleQuestions[selectedQuestion].id}
                    />
                  : exampleQuestions[selectedQuestion].type === "MULTIPLECHOICE"
                  ? <ChoiceQuestion 
                      texts={texts}
                      multiselect={true} 
                      question={exampleQuestions[selectedQuestion].question} 
                      answers={exampleQuestions[selectedQuestion].answers} 
                      randomizeAnswers={exampleQuestions[selectedQuestion].randomizeAnswers}
                      maxSelection={exampleQuestions[selectedQuestion].maxSelection}
                      minSelection={exampleQuestions[selectedQuestion].minSelection}
                      userAnswers={answers}
                      setUserAnswers={setAnswers}
                      questionId={exampleQuestions[selectedQuestion].id}

                    />
                  : exampleQuestions[selectedQuestion].type === "USERINPUT"
                  ? <TextQuestion
                      texts={texts}
                      question={exampleQuestions[selectedQuestion].question} 
                      placeHolder={exampleQuestions[selectedQuestion].placeHolder}
                      textinputMaxLength={exampleQuestions[selectedQuestion].textinputMaxLength}
                      textinputMinLength={exampleQuestions[selectedQuestion].textinputMinLength}
                      validationRegex={exampleQuestions[selectedQuestion].validationRegex}
                      userAnswers={answers}
                      setUserAnswers={setAnswers}
                      questionId={exampleQuestions[selectedQuestion].id}

                    />
                  : exampleQuestions[selectedQuestion].type === "RATING"
                  ? <RatingQuestion 
                      texts={texts}
                      question={exampleQuestions[selectedQuestion].question} 
                      scaleMin={exampleQuestions[selectedQuestion].scaleMin}
                      scaleMax={exampleQuestions[selectedQuestion].scaleMax}
                      scaleLabels={exampleQuestions[selectedQuestion].scaleLabels}
                      step={exampleQuestions[selectedQuestion].step}
                      unit={exampleQuestions[selectedQuestion].unit}
                      userAnswers={answers}
                      setUserAnswers={setAnswers}
                      questionId={exampleQuestions[selectedQuestion].id}

                    />
                  : exampleQuestions[selectedQuestion].type === "SLIDER"
                  ? <SliderQuestion  
                      texts={texts}
                      question={exampleQuestions[selectedQuestion].question} 
                      scaleMin={exampleQuestions[selectedQuestion].scaleMin}
                      scaleMax={exampleQuestions[selectedQuestion].scaleMax}
                      scaleLabels={exampleQuestions[selectedQuestion].scaleLabels}
                      step={exampleQuestions[selectedQuestion].step}
                      unit={exampleQuestions[selectedQuestion].unit}
                      minValue={exampleQuestions[selectedQuestion].minValue}
                      maxValue={exampleQuestions[selectedQuestion].maxValue}
                      userAnswers={answers}
                      setUserAnswers={setAnswers}
                      questionId={exampleQuestions[selectedQuestion].id}

                    />
                  : exampleQuestions[selectedQuestion].type === "YESNO"
                  ? <ChoiceQuestion  
                      texts={texts}
                      multiselect={false} 
                      question={exampleQuestions[selectedQuestion].question} 
                      answers={exampleQuestions[selectedQuestion].answers} 
                      randomizeAnswers={exampleQuestions[selectedQuestion].randomizeAnswers}
                      maxSelection={1}
                      minSelection={1}
                      userAnswers={answers}
                      setUserAnswers={setAnswers}
                      questionId={exampleQuestions[selectedQuestion].id}
                    />
                  : exampleQuestions[selectedQuestion].type === "NUMBERINPUT"
                  ? <NumericQuestion 
                      texts={texts}
                      question={exampleQuestions[selectedQuestion].question} 
                      placeHolder={exampleQuestions[selectedQuestion].placeHolder}
                      textinputMaxLength={exampleQuestions[selectedQuestion].textinputMaxLength}
                      textinputMinLength={exampleQuestions[selectedQuestion].textinputMinLength}
                      validationRegex={exampleQuestions[selectedQuestion].validationRegex}
                      step={exampleQuestions[selectedQuestion].step}
                      unit={exampleQuestions[selectedQuestion].unit}
                      minValue={exampleQuestions[selectedQuestion].minValue}
                      maxValue={exampleQuestions[selectedQuestion].maxValue}
                      userAnswers={answers}
                      setUserAnswers={setAnswers}
                      questionId={exampleQuestions[selectedQuestion].id}
                    />
                  : null
                }
              
              </View>

              <View className='flex-row justify-between mt-4 px-3'>
                <TouchableOpacity 
                  onPress={() => {
                    if (selectedQuestion > 0) {
                      setSelectedQuestion(selectedQuestion - 1);
                    } else {
                      setIsVisible(false)
                    }
                  }}
                  className='bg-gray-700 px-4 py-2 rounded-lg'
                >
                  {
                    selectedQuestion == 0 ?
                    <Icon name="arrow-left"  
                    size={25} 
                    color={"white"} />
                    : 
                    <Text className='text-white font-bold'>{texts.back}</Text>

                  }
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    if (selectedQuestion < exampleQuestions?.length - 1) {
                      setSelectedQuestion(selectedQuestion + 1);
                    } else {
                      setSelectedQuestion(0); // Reset to first question if last question is reached
                      onComplete(); // Callback when survey is completed
                      setIsVisible(false); // Close modal
                    }
                  }}
                  className='bg-blue-500 px-4 py-2 rounded-lg'
                >
                  <Text className='text-white font-bold'>{selectedQuestion === exampleQuestions?.length - 1 ? texts.finish : texts.continue}</Text>
                </TouchableOpacity>
            </View>
            </View>
              :null}
          </View>
    </Modal>
  )
}

export default ModalQuiz