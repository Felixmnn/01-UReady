import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import AnswerComponent from './answerComponent'
import { BlockMath } from 'react-katex';
import { maybeParseJSON } from '@/functions/(quiz)/helper';

const Question = ({
    question,
    showAnsers,
    selectedAnswers,
    setSelectedAnswers,
    width,
    quizType
}: {
    question: any,
    showAnsers: boolean,
    selectedAnswers: string[],
    setSelectedAnswers: React.Dispatch<React.SetStateAction<string[]>>,
    width: number,
    quizType: "single" | "multiple" | "questionAnswer",
}) => {

  function selectAnswer(answer:string) {
    if (quizType === "single" ) {
        setSelectedAnswers([answer])
        return;
    }
        if (selectedAnswers.includes(answer)) {
            setSelectedAnswers(selectedAnswers.filter((item) => item !== answer))
        } else {
            setSelectedAnswers([...selectedAnswers, answer])
        }
    }

    function parseIfIncludesLatex(item: string) {
        try {
            if (item.includes("latext")){
                return JSON.parse(item);
            } else {
                return {text:item, latex: "", image: ""};
            }
        } catch (e) {
            return {text:item, latex: "", image: ""};
        }}

        return (
            <ScrollView className='flex-1 w-full'>
                <Text className='text-white text-center px-4 px-2 text-xl font-bold mb-2'>{question.question}</Text>
                { 
                    question.questionLatex?.length > 0 ?
                        <ScrollView
                        horizontal
                        className="w-full"
                        contentContainerStyle={{ 
                            alignItems: "center", 
                            justifyContent: "flex-start" 
                        }}
                        >
                        <View style={{ width: "100%", marginLeft: 5 }}>
                            <BlockMath
                            math={question.questionLatex}
                            className="text-white"
                            style={{ color: "white", fontSize: 16 }}
                            />
                        </View>
                        </ScrollView>
                    : question.questionUrl?.length > 0  ?
                    <View className='w-full   rounded-lg overflow-hidden min-h-10 p-2 items-center px-4'>
                        <Image
                            source={{ uri: question.questionUrl }}
                            style={{
                                width: 200,             // feste Breite
                                aspectRatio: 1.5,       // Breite / Höhe → z.B. 3:2
                                borderRadius: 10,
                                resizeMode: 'contain',
                            }}
                            resizeMode="cover"
                            
                        />
                        
                    </View>
                    : null
                }
                <View className="flex-1 p-2">
                    {
                        quizType === "questionAnswer" && !showAnsers ?
                        <View/>
                        :
                        
                    question.answers.map((item:string, index:number) => {
                        const parsedItem = parseIfIncludesLatex(item);
                        const isCorrect = question.answerIndex.includes(index);
                        const isSelected = selectedAnswers.includes(JSON.stringify(parsedItem));
                        if (!isCorrect && quizType === "questionAnswer" ) return null;
                        return <AnswerComponent
                            key={index}                            
                            parsedItem={parsedItem} 
                            isCorrect={isCorrect}
                            isSelected={isSelected}
                            showAnsers={showAnsers}
                            selectAnswer={selectAnswer}
                            width={width}
                            index={index}
                            text={parsedItem.text}
                            latex={parsedItem.latex}
                            image={parsedItem.image}
                            questionType={quizType}
                            
                        />
                       
                    })}
                    </View>
                
                 </ScrollView>
        )
}

export default Question