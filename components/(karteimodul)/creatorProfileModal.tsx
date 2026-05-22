import { Modal, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AppwritePublicProfile } from "@/lib/collections/publicProfile";
import ProfileTagsSection from "../(general)/profileTagsSection";

type CreatorProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  creatorProfile: AppwritePublicProfile | null;
};

const CreatorProfileModal = ({
  visible,
  onClose,
  creatorProfile,
}: CreatorProfileModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-4">
        <View className="w-full  bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 z-10"
          >
            <Icon name="close" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View className="w-full items-center mb-4">
          <View className="bg-blue-900 border-gray-500 border-[1px] rounded-full h-[60px] w-[60px] items-center justify-center">
            <Text className="text-2xl text-gray-300 font-bold">
              {creatorProfile?.name[0]}
            </Text>
          </View>
          <Text className="text-gray-300 mt-1 font-bold">{creatorProfile?.name ?? "-"}</Text>

          </View>

          {creatorProfile?.bio ? (
            <View>
              <Text className="text-gray-400 mb-1">Bio:</Text>
              <Text className="text-gray-200 mb-3 ml-1">{creatorProfile.bio}</Text>
            </View>
          ) : null}

          <ProfileTagsSection
            educationKategory={creatorProfile?.educationKategory}
            badges={creatorProfile?.badges}
            creatorName={creatorProfile?.name}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CreatorProfileModal;
