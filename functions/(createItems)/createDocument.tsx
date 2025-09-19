import { addDocumentConfig, addDocumentToBucket, updateDocumentConfig } from '@/lib/appwriteEdit';
import * as DocumentPicker from 'expo-document-picker';
import uuid from 'react-native-uuid';

export async function addDocument (sessionID:string, subjectID:string){
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
        //Step 3 - Upload the Document
        const fileBlob = await fetch(file.uri).then(res => res.blob());
        const data = {
            fileID: doc.id,
            fileBlob: fileBlob,
        }
        const uploadRes = await addDocumentToBucket(data);
        //Set Upload to true && close the modal
        if (appwriteRes) {
            appwriteRes.uploaded = true;
            const final = await updateDocumentConfig(appwriteRes);
        }
        return;
                    
    } catch (error) {
        if (__DEV__) {
        console.log(error);
        }
    }
}