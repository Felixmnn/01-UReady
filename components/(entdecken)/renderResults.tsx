import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import Karteikarte from "../(karteimodul)/karteiKarte";
import Icon from "react-native-vector-icons/FontAwesome5";
import { module } from "@/types/appwriteTypes";
const RenderResults = ({
  modules,
  selectedModules,
  setSelectedModules,
  numColumns,
  searchBarText,
  getModules,
  setLoadingMore,
  loading,
  hasMore,
}: {
  modules: module[];
  selectedModules: string[];
  setSelectedModules: React.Dispatch<React.SetStateAction<string[]>>;
  numColumns: number;
  searchBarText: string;
  getModules: ({ loadingMore }: { loadingMore: boolean }) => void;
  setLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  hasMore: boolean;
}) => {
  return (
    <View className="flex-1 w-full pl-2 justify-center ">
      <FlatList
        data={modules}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Image
              source={require("../../assets/noResults.png")}
              style={{ width: 200, height: 200, borderRadius: 5 }}
            />
            <Text className="text-gray-300 font-bold text-[18px]">
              Keine Ergebnisse
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1 / numColumns, // verteilt Spalten gleichmäßig
              height: 180, // feste Höhe
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Karteikarte
              handlePress={() => {
                if (selectedModules.includes(item.$id ?? "")) {
                  setSelectedModules(
                    selectedModules.filter((module) => module !== item.$id)
                  );
                } else {
                  if (item.$id) {
                    setSelectedModules([...selectedModules, item.$id]);
                  }
                }
              }}
              farbe={item.color ?? "blue"}
              percentage={null}
              titel={item.name}
              studiengang={item.description}
              fragenAnzahl={item.questions}
              notizAnzahl={item.notes}
              creator={item.creator}
              publicM={item.public}
              reportVisible={true}
              moduleID={item.$id}
            />
          </View>
        )}
        keyExtractor={(item, index) => item.$id ?? `module-${index}`}
        key={numColumns} // wichtig, damit FlatList neu rendert bei Spaltenwechsel
        numColumns={numColumns}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!loading && hasMore) {
            setLoadingMore(true);
            getModules({ loadingMore: true });
          }
        }}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default RenderResults;
