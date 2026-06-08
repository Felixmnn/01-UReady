import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import KaTeXExample from "../(home)/katext";
import DisplayImage from "./(renderImage)/displayImage";

const AnswerComponent = ({
  index,
  selectAnswer,
  showAnsers,
  isCorrect,
  parsedItem,
  width,
  isSelected,
  text,
  latex,
  image,
}: {
  index: number;
  selectAnswer: (answer: string) => void;
  showAnsers: boolean;
  isCorrect: boolean;
  parsedItem: any;
  width: number;
  isSelected: boolean;
  text: string;
  latex: string;
  image: string;
}) => {
  function diceUpText(text:string){
    if (text[0] == "'") {
      text = text.slice(1);
    } 
    if (text[text.length - 1] == "'") {
      text = text.slice(0, -1);
    }
    if (text.includes("['")){
      text = text.slice(2);
    } 
    if (text.includes("']")){
      text = text.slice(0, -2);
    }
    if(text[0] == '"' ){
      text = text.slice(1);
    }
    if(text[text.length -1] == '"'){
      text = text.slice(0, -1);
    }
    if (text.includes('{"')){
      text = text.replace('{"', '');
    }
    if (text.includes('"}')){
      text = text.replace('"}', '');
    }
    text = text.replace(/(?:option|answer)"\s*:\s*"/g, "");
    return text.replace("❌","").replace("✅","");

  }

  return (
    <TouchableOpacity
      key={index}
      disabled={showAnsers}
      onPress={() => selectAnswer(JSON.stringify(parsedItem))}
      className={`${width > 900 ? 
        " mr-2 mt-2 max-w-[48%]"
        : ""} flex-1 items-center justify-center border-[1px] p-2 rounded-[10px] mb-2 
        ${
          showAnsers
            ? isCorrect
              ? "bg-green-900 border-green-600"
              : "bg-red-900 border-red-600"
            : isSelected
              ? "bg-blue-900 border-blue-600"
              : "bg-gray-800 border-gray-600"
        }`}
      style={{
        width: width > 900 ? (width - 100) / 2 : width - 40,
        marginBottom: 10,
        padding: 10,
      }}
    >
      <Text className="text-white text-center font-bold text-[18px]">
        {diceUpText(text)}
      </Text>
        { image && image.length > 0 && <DisplayImage imageId={image} /> }
        { latex && latex.length > 0 && <KaTeXExample formula={latex} />}

    </TouchableOpacity>
  );
};

export default AnswerComponent;
