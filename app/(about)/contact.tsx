import { addContact } from '@/lib/appwriteAdd';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

  const ErrorModal = ({isError, setIsError, success=false, successMessage=null}) => {
      return (
          <Modal
              animationType="slide"
              transparent={true}
              visible={isError || success}
              onRequestClose={() => {
                setIsError(!isError);
              }}
          >
              <TouchableOpacity className='flex-1 justify-start pt-5 items-center' onPress={()=> {setIsError(false); setSuccess(false)} }
                >
                  <View className='red border-red-600 border-[1px] rounded-[10px] p-5 bg-red-700'
                    style={{
                        backgroundColor: success ? 'green' : '#ff4d4d',
                        borderColor: success ? 'green' : '#ff4d4d',
                    }}
                  >
                      <Text className='text-white'>{successMessage ? successMessage : errorMessage}</Text>
                  </View>
              </TouchableOpacity>
          </Modal>
      )
  }

   async function handleSubmit() {
    if (!name || !email || !message) {
        setErrorMessage('Bitte fülle alle Felder aus.');
        setIsError(true);

    } else {
        
        await addContact({
            name:name,
            email:email, 
            message:message
        }) 
        setSuccessMessage('Deine Nachricht wurde erfolgreich gesendet!');
        setSuccess(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-[#0c111d] p-6">
        <View className="w-full flex-row items-center justify-between p-4  mb-4">
            <TouchableOpacity onPress={() => router.push("/profil")}>
                <Icon name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>
            Kontakt
            </Text>
            <View style={{width:20}}/>
        </View>

        <ErrorModal isError={isError} setIsError={setIsError} success={success} successMessage={successMessage} />
        <View className="flex-1 items-center justify-start">
        <View className="w-full" style={{ maxWidth: 700 }}>

      <Text className="text-base mb-1 text-white">Name</Text>
      <TextInput
        className="border border-blue-300 rounded-xl p-3 mb-4 bg-gray-800 text-gray-200"
        placeholder="Dein Name"
        maxLength={100}
        placeholderTextColor={'#888'}
        value={name}
        onChangeText={setName}
      />

      <Text className="text-base mb-1 text-white">E-Mail</Text>
      <TextInput
        className="border border-blue-300 rounded-xl p-3 mb-4 bg-gray-800 text-gray-200"
        placeholder="Deine E-Mail"
        maxLength={100}
        placeholderTextColor={'#888'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text className="text-base mb-1 text-white">Nachricht</Text>
      <TextInput
        className="border border-blue-300 rounded-xl p-3 mb-6 bg-gray-800 h-32 text-start text-gray-200"
        placeholder="Deine Nachricht"
        placeholderTextColor={'#888'}
        multiline
        maxLength={500}
        textAlignVertical="top"
        numberOfLines={5}
        value={message}
        onChangeText={setMessage}
      />

    {
        success || successMessage != null ?
        <TouchableOpacity
          className="bg-green-500 p-3 rounded-xl w-full"
          onPress={() => router.push('/home')}
        >
            <Text className="text-white text-center text-lg font-semibold">Zurück zur Startseite</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity
            className="bg-blue-600 py-3 rounded-xl"
            onPress={handleSubmit}
        >
            <Text className="text-white text-center text-lg font-semibold">Absenden</Text>
      </TouchableOpacity>
    }
      
    </View>
        </View>
    </ScrollView>
  );
};

export default Contact;
