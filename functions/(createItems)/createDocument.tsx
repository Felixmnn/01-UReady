import { addDocumentConfig, addDocumentToBucket, updateDocumentConfig } from '@/lib/appwriteEdit';
import * as DocumentPicker from 'expo-document-picker';
import uuid from 'react-native-uuid';

export async function addDocument (sessionID, subjectID){
    try {
         
        const res = await DocumentPicker.getDocumentAsync({type: "*/*"});

        if (res.canceled) {
            return;
        }
        //Step 1 - Create a new Document-Config
        const file = res.assets[0];

        const doc = {
            title: file.name,
            subjectID: subjectID,
            sessionID: sessionID,
            id: uuid.v4(),
            type: file.mimeType,
            uploaded:false,
        }
        //Step 2 - Save the Document-Config
        let appwriteRes = await addDocumentConfig(doc);
        if (appwriteRes) {
            console.log("Appwrite Response",appwriteRes);
        }
        //Step 3 - Upload the Document
        const fileBlob = await fetch(file.uri).then(res => res.blob());
        const data = {
            fileID: doc.id,
            fileBlob: fileBlob,
        }
        const uploadRes = await addDocumentToBucket(data);
        console.log("Upload Response",uploadRes);
        //Set Upload to true && close the modal
        appwriteRes.uploaded = true;
        const final = await updateDocumentConfig(appwriteRes);
        return;
                    
    } catch (error) {
        console.log(error);
    }
}