import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect } from 'react';
import CreateModule from '../createModule';

const AddModule = ({ isVisible, setIsVisible, newModule, setNewModule, amount = 0 }) => {
  useEffect(() => {
    setIsVisible(false);
  }, [amount]);

  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View
          className="absolute top-0 left-0 w-full h-full justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              className="h-full w-full rounded-[10px] p-2"
              style={{
                maxWidth: 700,
                maxHeight: 600,
              }}
            >
              <CreateModule
                newModule={newModule}
                setNewModule={setNewModule}
                setUserChoices={() => setIsVisible(false)}
                isModal={setIsVisible}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddModule;
