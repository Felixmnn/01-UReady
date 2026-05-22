import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const colorListTags = {
  t1: { background: "#1E40AF", border: "#60A5FA", text: "#F8FAFC" },
  t2: { background: "#0F766E", border: "#2DD4BF", text: "#F8FAFC" },
  t3: { background: "#166534", border: "#4ADE80", text: "#F8FAFC" },
  t4: { background: "#9A3412", border: "#FB923C", text: "#FFF7ED" },
  t5: { background: "#9F1239", border: "#FB7185", text: "#FFF1F2" },
  t6: { background: "#6D28D9", border: "#A78BFA", text: "#F5F3FF" },
  t7: { background: "#334155", border: "#94A3B8", text: "#F8FAFC" },
  t8: { background: "#92400E", border: "#FACC15", text: "#FFF8E1" },
} as const;

const tagLib = {
  SCHOOL: "t1",
  UNIVERSITY: "t2",
  EDUCATION: "t3",
  OTHER: "t4",
  DEFAULT: "t1",
  CREATOR: "t5",
  DOER: "t8",
} as const;

const synonymLib = {
  SCHOOL: {
    name: "Schüler",
    description: "ist Schüler.",
  },
  UNIVERSITY: {
    name: "Student",
    description: "ist Student.",
  },
  EDUCATION: {
    name: "Azubi",
    description: "ist Azubi.",
  },
  OTHER: {
    name: "Andere",
    description: "ist weder Schüler, Student noch Azubi.",
  },
  CREATOR: {
    name: "Kreativer",
    description: "hat eigene Lernsets erstellt und geteilt.",
  },
  DOER: {
    name: "Macher",
    description:
      "war der erste, der ein Lernset in einem bestimmten Bereich erstellt hat.",
  },
} as const;

type RenderTagProps = {
  tag: string;
  selectedTag: string | null;
  onPress: (tag: string) => void;
};

type ProfileTagsSectionProps = {
  educationKategory?: string | null;
  badges?: string[] | null;
  creatorName?: string;
  title?: string;
  descriptionTitle?: string;
  showEmptyDash?: boolean;
};

const RenderTag = ({ tag, selectedTag, onPress }: RenderTagProps) => {
  const colorKey =
    (tagLib[tag as keyof typeof tagLib] as keyof typeof colorListTags) ?? "t1";
  const colors = colorListTags[colorKey];
  const tagInfo = synonymLib[tag as keyof typeof synonymLib];

  return (
    <TouchableOpacity
      onPress={() => onPress(tag)}
      className="rounded-full mr-2 mb-2"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: selectedTag === tag ? 2 : 1,
        paddingHorizontal: 8,
        paddingVertical: 2,
      }}
    >
      <Text style={{ color: colors.text }} className="text-sm font-medium">
        {tagInfo?.name ?? tag}
      </Text>
    </TouchableOpacity>
  );
};

const ProfileTagsSection = ({
  educationKategory,
  badges,
  creatorName,
  title = "Tags:",
  descriptionTitle = "Description",
  showEmptyDash = true,
}: ProfileTagsSectionProps) => {
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

  const normalizedEducationTag = educationKategory ? String(educationKategory) : null;
  const normalizedBadges = badges ?? [];
  const hasAnyTag = Boolean(normalizedEducationTag) || normalizedBadges.length > 0;

  const selectedTagInfo = selectedTag
    ? synonymLib[selectedTag as keyof typeof synonymLib]
    : null;

  const handleTagPress = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <View>
      <Text className="text-gray-400 mb-1">{title}</Text>

      <View className="flex-row flex-wrap mb-3">
        {normalizedEducationTag ? (
          <RenderTag
            tag={normalizedEducationTag}
            selectedTag={selectedTag}
            onPress={handleTagPress}
          />
        ) : null}

        {normalizedBadges.map((tag, index) => (
          <RenderTag
            key={`${tag}-${index}`}
            tag={tag}
            selectedTag={selectedTag}
            onPress={handleTagPress}
          />
        ))}

        {!hasAnyTag && showEmptyDash ? (
          <Text className="text-gray-200">-</Text>
        ) : null}
      </View>
      {selectedTag ? (
        <View className="rounded-xl">
          <Text className="text-gray-400 mb-1">{descriptionTitle}</Text>
          <Text className="text-gray-300 text-sm">
            {creatorName ? `${creatorName} ` : ""}
            {selectedTagInfo?.description ?? "Keine Beschreibung vorhanden."}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default ProfileTagsSection;
