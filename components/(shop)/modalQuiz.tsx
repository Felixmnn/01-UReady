import { View, Text, Modal, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import ChoiceQuestion from './(survey)/choiceQuestion';
import NumericQuestion from './(survey)/numericQuestion';
import RatingQuestion from './(survey)/ratingQuestion';
import SliderQuestion from './(survey)/sliderQuestion';
import TextQuestion from './(survey)/textQuestion';
import Questions from '../(bibliothek)/(pages)/(createQuestion)/questions';

const ModalQuiz = ({isVisible, setIsVisible, onComplete, texts}) => {
  const { width } = useWindowDimensions();
  const exampleSurvey = {
    title: "Survey Example",  //Title
    questions: [              // Array of IDs
      "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7" // Array of Question IDs
    ],
    reward: [
      { type: "coins", amount: 100 }, // Object
      { type: "points", amount: 50 }, // Object
    ],          
    $id: "survey123",           // ID
    targetGroup : "all",        // ENUM
    maxResondants: 100,         // Number
    participations: 0,          // Number
    isActive: true,            // Boolean
    startDate: new Date().toISOString(), // ISO String
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // ISO String, 7 days from now
    isRepeatable: false, // Boolean
    isAnonymous: true, // Boolean
    tags: ["example", "survey"], // Array of Strings
      }
    
    const exampleQuestions = [
  {
    id: "Q1",
    type: "single-choice",
    question: "What is your favorite season?",
    answers: ["Spring", "Summer", "Autumn", "Winter"],
    randomizeAnswers: false,
    maxSelection: 1,
    minSelection: 1,
    placeHolder: "Select one season",
    textinputMaxLength: null,
    textinputMinLength: null,
    validationRegex: null,
    scaleMin: null,
    scaleMax: null,
    scaleLabels: null,
    step: null,
    unit: null,
    minValue: null,
    maxValue: null,
    imageUrl: "https://example.com/image1.jpg",
    videoUrl: "https://example.com/video1.mp4",
    audioUrl: "https://example.com/audio1.mp3",
    skipIf: null,
    showIf: null
  },
  {
    id: "Q2",
    type: "multiple-choice",
    question: "Which hobbies do you enjoy?",
    answers: ["Reading", "Traveling", "Gaming", "Cooking"],
    randomizeAnswers: true,
    maxSelection: 3,
    minSelection: 1,
    placeHolder: "Select at least one hobby",
    textinputMaxLength: null,
    textinputMinLength: null,
    validationRegex: null,
    scaleMin: null,
    scaleMax: null,
    scaleLabels: null,
    step: null,
    unit: null,
    minValue: null,
    maxValue: null,
    imageUrl: "https://example.com/image2.jpg",
    videoUrl: "https://example.com/video2.mp4",
    audioUrl: "https://example.com/audio2.mp3",
    skipIf: null,
    showIf: null
  },
  {
    id: "Q3",
    type: "user-input",
    question: "Please describe your ideal weekend.",
    answers: null,
    randomizeAnswers: null,
    maxSelection: null,
    minSelection: null,
    placeHolder: "Type your answer here...",
    textinputMaxLength: 300,
    textinputMinLength: 10,
    validationRegex: ".*",
    scaleMin: null,
    scaleMax: null,
    scaleLabels: null,
    step: null,
    unit: null,
    minValue: null,
    maxValue: null,
    imageUrl: "https://example.com/image3.jpg",
    videoUrl: null,
    audioUrl: null,
    skipIf: null,
    showIf: null
  },
  {
    id: "Q4",
    type: "rating",
    question: "How satisfied are you with our service?",
    answers: null,
    randomizeAnswers: null,
    maxSelection: null,
    minSelection: null,
    placeHolder: null,
    textinputMaxLength: null,
    textinputMinLength: null,
    validationRegex: null,
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ["Very Bad", "Bad", "Neutral", "Good", "Excellent"],
    step: 1,
    unit: null,
    minValue: null,
    maxValue: null,
    imageUrl: null,
    videoUrl: null,
    audioUrl: null,
    skipIf: null,
    showIf: null
  },
  {
    id: "Q5",
    type: "slider",
    question: "How many hours do you work per week?",
    answers: null,
    randomizeAnswers: null,
    maxSelection: null,
    minSelection: null,
    placeHolder: null,
    textinputMaxLength: null,
    textinputMinLength: null,
    validationRegex: null,
    scaleMin: 0,
    scaleMax: 80,
    scaleLabels: ["Low", "Medium", "High"],
    step: 1,
    unit: "hours",
    minValue: null,
    maxValue: null,
    imageUrl: null,
    videoUrl: null,
    audioUrl: null,
    skipIf: null,
    showIf: null
  },
  {
    id: "Q6",
    type: "yes-no",
    question: "Do you exercise regularly?",
    answers: ["Yes", "No"],
    randomizeAnswers: false,
    maxSelection: 1,
    minSelection: 1,
    placeHolder: null,
    textinputMaxLength: null,
    textinputMinLength: null,
    validationRegex: null,
    scaleMin: null,
    scaleMax: null,
    scaleLabels: null,
    step: null,
    unit: null,
    minValue: null,
    maxValue: null,
    imageUrl: null,
    videoUrl: null,
    audioUrl: null,
    skipIf: null,
    showIf: null
  },
  {
    id: "Q7",
    type: "number-input",
    question: "How old are you?",
    answers: null,
    randomizeAnswers: null,
    maxSelection: null,
    minSelection: null,
    placeHolder: "Enter your age",
    textinputMaxLength: null,
    textinputMinLength: null,
    validationRegex: null,
    scaleMin: null,
    scaleMax: null,
    scaleLabels: null,
    step: 1,
    unit: "years",
    minValue: 0,
    maxValue: 120,
    imageUrl: null,
    videoUrl: null,
    audioUrl: null,
    skipIf: null,
    showIf: null
  }
];
  const widthMax = width > 600 ? 600 : width - 60; // Max width for the modal
  const widthEachCompartment = (widthMax - exampleQuestions.length * 10) / exampleQuestions.length;

  const [ selectedQuestion, setSelectedQuestion ] = useState(0);
  const [ answers, setAnswers ] = useState({
    "Q1": null,
    "Q2": [],
    "Q3": "",
    "Q4": null,
    "Q5": null,
    "Q6": null,
    "Q7": null
  }); 

  useEffect(() => {
    console.log(answers)
  },[answers])
  return (
    <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        >
          <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
            <View className=' p-4 rounded-lg bg-gray-800'>
              {/* Status Bar */}
              <View className='flex-row items-center bg-gray-900'style={{width: "100%",height: 16,borderRadius: 8}}>
                {
                  exampleQuestions.map((i,index)=> {
                    return (
                      <View key={index}  style={{width:widthEachCompartment, marginHorizontal: 6, height:8, backgroundColor: index <= selectedQuestion ? "#3B82F6" : "#CBD5E1", borderRadius:4}}/>
                    )
                  })
                }
              </View>

              <View className='items-center justify-center'>
                {
                  exampleQuestions[selectedQuestion].type === "single-choice"
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
                  : exampleQuestions[selectedQuestion].type === "multiple-choice"
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
                  : exampleQuestions[selectedQuestion].type === "user-input"
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
                  : exampleQuestions[selectedQuestion].type === "rating"
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
                  : exampleQuestions[selectedQuestion].type === "slider"
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
                  : exampleQuestions[selectedQuestion].type === "yes-no"
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
                  : exampleQuestions[selectedQuestion].type === "number-input"
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

              <View className='flex-row justify-between mt-4'>
                <TouchableOpacity 
                  onPress={() => {
                    if (selectedQuestion > 0) {
                      setSelectedQuestion(selectedQuestion - 1);
                    }
                  }}
                  disabled={selectedQuestion === 0}
                  className='bg-gray-700 px-4 py-2 rounded-lg'
                >
                  <Text className='text-white font-bold'>{texts.back}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    if (selectedQuestion < exampleQuestions.length - 1) {
                      setSelectedQuestion(selectedQuestion + 1);
                    } else {
                      setSelectedQuestion(0); // Reset to first question if last question is reached
                      onComplete(); // Callback when survey is completed
                      setIsVisible(false); // Close modal
                    }
                  }}
                  className='bg-blue-500 px-4 py-2 rounded-lg'
                >
                  <Text className='text-white font-bold'>{selectedQuestion === exampleQuestions.length - 1 ? texts.finish : texts.continue}</Text>
                </TouchableOpacity>
            </View>
            </View>
          </View>
    </Modal>
  )
}

export default ModalQuiz