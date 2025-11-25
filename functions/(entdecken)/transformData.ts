// Define types for the objects being processed
interface Session {
    title: string;
    percent: number;
    color: string | null;
    iconName: string;
    questions: number;
    description: string;
    tags: string[];
    id: string;
    generating: boolean;
}

interface Question {
    id: string;
    status: null;
}

export function repairAndParseJSONStringsSessions(csvData: string[]): Session[] {
    // Hilfsfunktion, um einen String zu reparieren und in ein JSON-Objekt umzuwandeln
    try {
        let csvDataParsed = csvData.map(i=> JSON.parse(i));
        console.log("Parsed Session List",csvDataParsed)
        return csvDataParsed;
    } catch (error) {
        // This will happen when the data comes from the csv
    }
    let c = 0
    let objects: Session[] = [];
    let newOBJ: Session = {
        title: "",
        percent: 0,
        color: null,
        iconName: "question",
        questions: 0,
        description: "",
        tags: [],
        id: "",
        generating: false
    }
    csvData.map(i => {
        if (i.includes('title')) {
            i = i.replace(`['{"title": "`, "");
            i = i.replace(`'{"title": "`, "");
            i = i.slice(0, i.length - 1); 
            i = i.replace('\\\\u00e4','ä'); 
            i = i.replace('\\\\u00f6','ö');
            i = i.replace('\\\\u00fc','ü');
            i = i.replace('\\\\u00c4','Ä');
            i = i.replace('\\\\u00d6','Ö');
            i = i.replace('\\\\u00dc','Ü');
            i = i.replace('\\\\u00df','ß');
            newOBJ.title = i;
        } else if (i.includes("id:")) {
            i = i.replace("id:", "").trim();
            i = i.replace('"',"");
            i = i.replace('"',"");
            newOBJ.id = i;
        }
        c++;

        if (c === 9) {

            objects.push(newOBJ);
            newOBJ = {
                title: "",
                percent: 0,
                color: null,
                iconName: "question",
                questions: 0,
                description: "",
                tags: [],
                id: "",
                generating: false
            }
            c = 0;
        }

    });
    return objects;
    

}

export function repairQuestionList(csvData: string[]): Question[] {
    try {
        let csvDataParsed = csvData.map(i=> JSON.parse(i));
        return csvDataParsed;
    } catch (error) {
        // This will happen when the data comes from the csv
    }
    let newList: Question[] = [];
    let c = 0;
    csvData.map(i=> {
        if (i.includes("id")) {
        i = i.replace(`['{\"id\": \"`,"");
        i = i.replace(`'{\"id\": \"`,"");
        i = i.replace(`\"","status: null}'`,"")
        i = i.replace('"',"").trim();
        newList.push({id:i, status: null})
        }
    })
    console.log("New List", newList)
    return newList;
}