import { addContact } from '@/lib/appwriteAdd';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';import { useTranslation } from 'react-i18next';
import ErrorModal from '@/components/(general)/(modal)/errorModal';
import CustomButton from '@/components/(general)/customButton';

const Contact = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit() {
    const sucess = t('contact.successMessage');
    const fail = t('contact.errorMessage');
    if (!name || !email || !message) {
        setErrorMessage(fail);
        setIsError(true);

    } else {
        
        await addContact({
            name:name,
            email:email, 
            message:message
        }) 
        setSuccessMessage(sucess);
        setSuccess(true);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-[#0c111d] p-2 py-6">
      <View className="w-full flex-row items-center justify-between p-2  mb-4">
          <TouchableOpacity onPress={() => router.push("/profil")}>
              <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>
          {t('contact.contact')}

          </Text>
          <View style={{width:20}}/>
      </View>

      <ErrorModal isError={isError} 
                  setIsError={setIsError} 
                  success={success} 
                  successMessage={successMessage}  
                  setSuccess={setSuccess}
                  errorMessage={errorMessage}
                  />
      <View className="flex-1 items-center justify-start">
        <View className="w-full" style={{ maxWidth: 700 }}>
        <Text className="text-base mb-1 text-white">{t('contact.name')}</Text>
        <TextInput
          className="border border-blue-300 rounded-xl p-3 mb-4 bg-gray-800 text-gray-200"
          placeholder={t('contact.yourName')}
          maxLength={100}
          placeholderTextColor={'#888'}
          value={name}
          onChangeText={setName}
        />
        <Text className="text-base mb-1 text-white">{t('contact.email')}</Text>
        <TextInput
          className="border border-blue-300 rounded-xl p-3 mb-4 bg-gray-800 text-gray-200"
          placeholder= {t('contact.yourEmail')}
          maxLength={100}
          placeholderTextColor={'#888'}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="text-base mb-1 text-white">{t('contact.message')}</Text>
        <TextInput
          className="border border-blue-300 rounded-xl p-3 mb-6 bg-gray-800 h-32 text-start text-gray-200"
          placeholder={t('contact.yourMessage')}
          placeholderTextColor={'#888'}
          multiline
          maxLength={500}
          textAlignVertical="top"
          numberOfLines={5}
          value={message}
          onChangeText={setMessage}
        />

      {
        successMessage ?
        <CustomButton 
          title={t('contact.backToHome')}
          handlePress={() => router.push('/home')}
          containerStyles='bg-green-700 border-green-800 rounded-lg'
        />
        
        :
        <CustomButton
            title={t('contact.send')}
            handlePress={handleSubmit}
            containerStyles='bg-blue-700 border-blue-800 rounded-lg'
            />
      }
      
      </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default Contact;
