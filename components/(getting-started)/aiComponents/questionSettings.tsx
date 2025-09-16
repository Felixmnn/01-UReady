import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

const QuestionSettings = ({
  questionOptions,
  setQuestionOptions,
}: {
  questionOptions: {
    amountOfAnswers: number;
    questionsType: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TEXT';
  };
  setQuestionOptions: React.Dispatch<
    React.SetStateAction<{
      amountOfAnswers: number;
      questionsType: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TEXT';
    }>
  >;
}) => {
  const { t } = useTranslation();

  const questionTypeMap = {
    MULTIPLE_CHOICE: { label: t('createModule.mutipleChoice'), icon: 'check-square' },
    SINGLE_CHOICE: { label: t('createModule.singleChoice'), icon: 'dot-circle' },
    TEXT: { label: t('createModule.questionAnswer'), icon: 'font' },
  };

  return (
    <View className='mb-2'>
      {/* Header */}
      <Text className="text-gray-300 text-lg font-semibold">
        {t('createModule.settings')}
      </Text>

      {/* Auswahl des Fragetypen */}
      <View className="w-full flex-row flex-wrap justify-start items-center">
        {Object.keys(questionTypeMap).map((key) => {
          const type = key as 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TEXT';
          const { label, icon } = questionTypeMap[type];
          const isActive = questionOptions.questionsType === type;

          return (
            <TouchableOpacity
              key={type}
              className={`px-3 py-2 flex-row items-center justify-center rounded-[10px] border-[1px] shadow-lg mr-2 mb-2 ${
                isActive ? 'bg-blue-600 border-blue-400' : 'bg-[#0c111d] border-gray-800'
              }`}
              onPress={() =>
                setQuestionOptions({
                  ...questionOptions,
                  questionsType: type,
                })
              }
            >
              <Icon
                name={icon}
                size={15}
                color={isActive ? '#fff' : '#9CA3AF'}
              />
              <Text
                className={`ml-2 font-semibold text-[12px] ${
                  isActive ? 'text-white' : 'text-gray-300'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Anzahl der Antworten einstellen */}
      {questionOptions.questionsType !== 'TEXT' && (
        <View className="flex-row items-center">
          <Text className="text-gray-300 font-semibold mr-3">
            {t('createModule.numberOfAnswers')}:
          </Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="bg-[#0c111d] border-gray-800 border-[1px] rounded-[10px] p-2 shadow-lg mr-2"
              onPress={() =>
                setQuestionOptions({
                  ...questionOptions,
                  amountOfAnswers: Math.max(1, questionOptions.amountOfAnswers - 1),
                })
              }
            >
              <Icon name="minus" size={12} color="#9CA3AF" />
            </TouchableOpacity>

            <Text className="text-gray-200 font-bold text-base mx-2">
              {questionOptions.amountOfAnswers}
            </Text>

            <TouchableOpacity
              className="bg-[#0c111d] border-gray-800 border-[1px] rounded-[10px] p-2 shadow-lg ml-2"
              onPress={() =>
                setQuestionOptions({
                  ...questionOptions,
                  amountOfAnswers: questionOptions.amountOfAnswers + 1,
                })
              }
            >
              <Icon name="plus" size={12} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default QuestionSettings;
