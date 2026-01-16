import { View, Text, Image, Animated } from "react-native";
import React, { use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BotWaiting = ({ message = "", amountOfQuestions = 0 }) => {

    
            const {t} = useTranslation();



    const FunFacts = ({
        amountOfQuestions
    }: {
        amountOfQuestions: number;
    }) => {
            const [funFact, setFunFact] = useState("...");
            const [ usedFunFacts, setUsedFunFacts ] = useState<Number[]>([]);

            const funFacts: any  = t("funFacts.items", {
                returnObjects: true,
                });

       useEffect(() => {
        const interval = setInterval(() => {
           
                const randomIndex = Math.floor(Math.random() * funFacts.length);
                if (usedFunFacts.includes(randomIndex)) {
                    const randomIndex = Math.floor(Math.random() * funFacts.length);
                    setFunFact(funFacts[randomIndex]);
                    setUsedFunFacts((prev) => [...prev, randomIndex]);
                } else {
                    setFunFact(funFacts[randomIndex]);
                    setUsedFunFacts((prev) => [...prev, randomIndex]);
                }
            
        },8000)
        return () => clearInterval(interval);
    }, []);

        return <Text className="text-gray-300 mt-2 text-center ">{funFact}</Text>;

    }

   
   

  const TypewriterText = ({
    text,
    speed = 50,
  }: {
    text: string;
    speed?: number;
  }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
      let index = 0;
      let isCancelled = false;

      const typeNext = () => {
        if (index < text.length -1) {
          setDisplayedText((prev) => prev + text[index]);
          index++;
          setTimeout(typeNext, speed);
        }
      };

      typeNext();
      TypewriterText

      return () => {
        isCancelled = true;
      };
    }, [text]);

    return (
      <Text style={{ color: "white", fontSize: 18 }}>{displayedText}</Text>
    );
  };

    const [progressWidth] = useState(new Animated.Value(0));
    const [estimatedSeconds, setEstimatedSeconds] = useState<number | null>(null);

    useEffect(() => {
      const totalDuration = amountOfQuestions * 200; 
      const estimatedTime = Math.ceil(totalDuration / 1000);
      setEstimatedSeconds(estimatedTime);
        Animated.timing(progressWidth, {
            toValue: 280,
            duration: totalDuration,
            useNativeDriver: false,
        }).start(); 
    }, [amountOfQuestions]);

  return (
    <View className="items-center justiy-center p-5 bg-gray-900">
      <View 
        className="bg-blue-500 p-4 rounded-lg shadow-lg"
        style={{
          maxWidth: 300,
          minWidth: 200,
          borderRadius: 15,
          position: "relative",
          right: 10,
          bottom: 10,
        }}
      >

        <TypewriterText text={t("funFacts.loading", { amountOfQuestions })[0] + t("funFacts.loading", { amountOfQuestions })} speed={40} />
        <View
          style={{
            position: "absolute",
            bottom: -10,
            left: "50%",
            width: 0,
            height: 0,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderTopWidth: 10,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: "#3B82F6",
          }}
        />
      </View>
      
      <Image
        source={require("../../assets/Waiting.gif")}
        style={{ height: 150, width: 150 }}
      />
      {/* Progress bar */}
      <View style={{ width: 280, marginTop: 8 }}>
        <View
          style={{
            height: 10,
            borderRadius: 9999,
            overflow: "hidden",
            backgroundColor: "#1F2937",
          }}
        >
          <Animated.View
            style={{
              height: 10,
              width: progressWidth as unknown as number,
              backgroundColor: "#3B82F6",
            }}
          />
        </View>
      </View>
      <FunFacts amountOfQuestions={amountOfQuestions} />
    </View>
  );
};

export default BotWaiting;
