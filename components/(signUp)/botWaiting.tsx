import { View, Text, Image, Animated } from "react-native";
import React, { use, useEffect, useState } from "react";

const BotWaiting = ({ message = "", amountOfQuestions = 0 }) => {

    



    const FunFacts = ({
        amountOfQuestions
    }: {
        amountOfQuestions: number;
    }) => {
            const [funFact, setFunFact] = useState(`Geschätzte Dauer: ca. ${Math.round(amountOfQuestions * 0.2)} Sekunden`);
            const [ usedFunFacts, setUsedFunFacts ] = useState<Number[]>([]);

            const funFacts = [
            "Wusstest du, dass du nach dem Laden der Fragen komplett offline arbeiten kannst?",
            "Nutze die Entdeckungsfunktion, um Lerninhalte von anderen Nutzern zu finden!",
            "Du kannst die Map Funktion nutzenm um deine Lernsets zu strukturieren!",
            "Das teilen von Lernsets mit Feunden kostet keine Energie!",
            "Du kannst zwischen 4 Lernmodi wählen wenn du ein quiz über das play symbol startest!",
            "Du kannst in der entdeckungsfunktion auch nach beschreibungen und nutzername suchen!",
            "Wenn deine Energie aufgebraucht ist, füllt sich diese alle 2 Stunden um 1 Einheit wieder auf!",
            "Du kannst QReady so viel nutzen wie du willst, es gibt keine Begrenzung!",
            "Du kannst Lernsets beim erstellen auf öffentlich stellen, damit andere Nutzer diese finden können!",
            "Du kannst QReady in Deutsch, Englisch, Französisch und Spanisch nutzen!",
            "Wenn du QReady auf Englisch nutzt, werden Fragen bei Ki funktionen automatisch auf Englisch generiert!",
            "Über die Entdecken Funktion kannst du mehr als 10.000 Lernsets von anderen Nutzern finden!",
            "Im Profil kannst du deine Lernziel jedem Lernset individuell anpassen!",
            "Du kannst neben Text auch Bilder und Formeln in deinen Lernsets nutzen!",
            "Auch bilder und formeln kannst du offline nutzen, nachdem du die Fragen geladen hast!",
            "Deine Fragen werden gerade aus eine Datenbank mit Millionen von Fragen herausgesucht!",
        ] 
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
    <View className="items-center justiy-center p-4 bg-gray-900">
      <View 
        className="bg-blue-500 p-4 rounded-lg shadow-lg"
        style={{
          maxWidth: 300,
          minWidth: 200,
          borderRadius: 15,
          position: "relative",
          right: 20,
          bottom: 10,
        }}
      >

        <TypewriterText text={`Giib mir einen Moment, um deine ${amountOfQuestions} Quizfragen zu laden.`} speed={40} />
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
