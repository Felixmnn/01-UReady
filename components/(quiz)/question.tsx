import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import AnswerComponent from "./answerComponent";
import { BlockMath } from "react-katex";
import { maybeParseJSON } from "@/functions/(quiz)/helper";
import KaTeXExample from "../(home)/katext";

const Question = ({
  question,
  showAnsers,
  selectedAnswers,
  setSelectedAnswers,
  width,
  quizType,
}: {
  question: any;
  showAnsers: boolean;
  selectedAnswers: string[];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  width: number;
  quizType: "single" | "multiple" | "questionAnswer";
}) => {
  console.log("Question Rendered", question)

  function selectAnswer(answer: string) {
    if (quizType === "single") {
      setSelectedAnswers([answer]);
      return;
    }
    if (selectedAnswers.includes(answer)) {
      setSelectedAnswers(selectedAnswers.filter((item) => item !== answer));
    } else {
      setSelectedAnswers([...selectedAnswers, answer]);
    }
  }

  function parseIfIncludesLatex(item: string) {
    try {
      if (item.includes("latex")) {
        return JSON.parse(item);
      } else {
        return { title: item, latex: "", image: "" };
      }
    } catch (e) {
      return { title: item, latex: "", image: "" };
    }
  }

  return (
    <ScrollView className="flex-1 w-full">
      <Text className="text-white text-center px-4 px-2 text-xl font-bold mb-2">
        {question.question}
      </Text>
      {question.questionLatex?.length > 0 ? (
          <View className="w-full rounded-lg overflow-hidden min-h-10 mx-2" >
            <KaTeXExample
              formula={question.questionLatex}
              fontSize={16}
            />
          </View>
      ) : question.questionUrl?.length > 0 ? (
        <View className="w-full   rounded-lg overflow-hidden min-h-10 p-2 items-center px-4">
          <Image
            source={{ uri: question.questionUrl }}
            style={{
              width: "100%", // feste Breite
              aspectRatio: 1.5, // Breite / Höhe → z.B. 3:2
              borderRadius: 10,
              resizeMode: "contain",
            }}
            resizeMode="cover"
          />
        </View>
      ) : null}
      <View className="flex-1 p-2">
        {quizType === "questionAnswer" && !showAnsers ? (
          <View />
        ) : (
          question.answers.map((item: string, index: number) => {
            const parsedItem = parseIfIncludesLatex(item);
            const isCorrect = question.answerIndex.includes(index);
            const isSelected = selectedAnswers.includes(
              JSON.stringify(parsedItem)
            );
            if (!isCorrect && quizType === "questionAnswer") return null;
            return (
              <AnswerComponent
                key={index}
                parsedItem={parsedItem}
                isCorrect={isCorrect}
                isSelected={isSelected}
                showAnsers={showAnsers}
                selectAnswer={selectAnswer}
                width={width}
                index={index}
                text={parsedItem.title}
                latex={parsedItem.latex}
                image={parsedItem.image}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default Question;
