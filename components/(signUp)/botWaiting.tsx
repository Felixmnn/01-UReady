import { View, Text, Image, Animated } from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BotWaiting = ({ message = "", amountOfQuestions = 0 }) => {

    
            const {t} = useTranslation();

   
   

  const TypewriterText = ({
    initialText,
    funFacts,
    speed = 50,
    pauseBetweenFacts = 3000,
  }: {
    initialText: string;
    funFacts: string[];
    speed?: number;
    pauseBetweenFacts?: number;
  }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
      let cancelled = false;

      const sleep = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));

      const typeText = async (text: string) => {
        setDisplayedText("");
        for (let i = 0; i < text.length; i++) {
          if (cancelled) return;
          setDisplayedText((prev) => prev + text[i]);
          await sleep(speed);
        }
      };

      const run = async () => {
        // Type the initial/loading text first
        await typeText(initialText ?? "");
        await sleep(1000);

        // Then cycle through fun facts, avoiding repeats until all are shown
        let used: number[] = [];
        const total = funFacts?.length ?? 0;

        while (!cancelled && total > 0) {
          let idx = Math.floor(Math.random() * total);
          if (used.length >= total) used = [];
          while (used.includes(idx)) idx = Math.floor(Math.random() * total);
          used.push(idx);

          await typeText(funFacts[idx]);
          await sleep(pauseBetweenFacts);
        }
      };

      run();

      return () => {
        cancelled = true;
      };
    }, [initialText, funFacts, speed, pauseBetweenFacts]);

    return (
      <Text style={{ color: "white", fontSize: 18 }}>{displayedText}</Text>
    );
  };

    const [progressWidth] = useState(new Animated.Value(0));
    const [estimatedSeconds, setEstimatedSeconds] = useState<number | null>(null);

    useEffect(() => {
      const totalDuration = amountOfQuestions * 400; 
      const estimatedTime = Math.ceil(totalDuration / 1000);
      setEstimatedSeconds(estimatedTime);
        Animated.timing(progressWidth, {
            toValue: 280,
            duration: totalDuration,
            useNativeDriver: false,
        }).start(); 
    }, [amountOfQuestions]);

  return (
    <View className="items-center justify-center p-5 bg-gray-900">
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
        <TypewriterText 
          initialText={t("funFacts.loading", { amountOfQuestions }) as unknown as string}
          funFacts={t("funFacts.items", { returnObjects: true }) as unknown as string[]}
          speed={40}
          pauseBetweenFacts={5000}
        />
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
    </View>
  );
};

export default BotWaiting;
