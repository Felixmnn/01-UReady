//Function that handles the next question and updates the status of the question
  export  async function nextQuestion({status,
         change,
         questionsParsed,
         selectedQuestion,
            questionList,
            setQuestionList,
            setQuestionParsed,
            setSelectedQuestion,
            setShowAnswers,
            updateDocument
        }
         :{
        status: "GOOD" | "BAD" | "OK" | "GREAT",
        change: 1 | -1,
        questionsParsed: any[],
        selectedQuestion: number,
        questionList: any[],
        setQuestionList: React.Dispatch<React.SetStateAction<any[]>>,
        setQuestionParsed: React.Dispatch<React.SetStateAction<any[]>>,
        setSelectedQuestion: React.Dispatch<React.SetStateAction<number>>,
        setShowAnswers: React.Dispatch<React.SetStateAction<boolean>>,
        updateDocument: (data: any) => Promise<any>,
    }
    ) {
    setShowAnswers(false);

    const currentQuestionId = questionsParsed[selectedQuestion].$id;
    const currentStatus = questionList.find(q => q.id === currentQuestionId)?.status || null;

    // Neue Statuslogik
    let newStatus = status;
    if ((currentStatus === "GOOD" || currentStatus === "GREAT") && status === "GOOD") {
        newStatus = "GREAT";
    }

    const indexOfQuestion = questionList.findIndex(q => q.id === currentQuestionId);

    if (indexOfQuestion === -1) {
        setQuestionList(prev => [
            ...prev,
            {
                id: currentQuestionId,
                status: newStatus,
            }
        ]);
    } else {
        setQuestionList(prev => {
            const updated = [...prev];
            updated[indexOfQuestion] = {
                ...updated[indexOfQuestion],
                status: newStatus,
            };
            return updated;
        });
    }

    // Update parsed list (falls benötigt)
    setQuestionParsed(prev =>
        prev.map((q, i) =>
            i === selectedQuestion ? { ...q, status: newStatus } : q
        )
    );

    // Persistiere Änderung im Backend
    await updateDocument({
        ...questionsParsed[selectedQuestion],
        status: newStatus
    });

    // Frage wechseln
    if (change === 1) {
        setSelectedQuestion((selectedQuestion + 1) % questionsParsed.length);
    } else {
        setSelectedQuestion(
            selectedQuestion === 0 ? questionsParsed.length - 1 : selectedQuestion - 1
        );
    }
    }