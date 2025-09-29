import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import KaTeXExample from '@/components/(home)/katext';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ToggleSwitch from '@/components/(general)/toggleSwich';
import { extractHeightFromLatex, extractZoomFromLatex, returnHeight, returnTextSize } from '@/functions/editQuestion';

const ContentInput = ({
    questionToEdit,
    setQuestionToEdit,
    itemIndex = 0,
    title = "",
    dataTmp = "text",
    latexTmp = "",
    imageTmp = "",
    correctAnswerTmp = false,
    typeOfQuestion = false,
  }: {
    questionToEdit: any;
    setQuestionToEdit: React.Dispatch<React.SetStateAction<any>>;
    itemIndex?: number;
    title: string;
    dataTmp: "text" | "latex" | "image";
    latexTmp: string;
    imageTmp: string;
    correctAnswerTmp: boolean;
    typeOfQuestion?: boolean;
  }) => {
    const { t } = useTranslation()
    const [text, setText] = useState(title);
    const [detailsHidden, setDetailsHidden] = useState(true);
    const [textVisible, setTextVisible] = useState(true);
    const [dataType, setDataType] = useState(dataTmp);
    const [latex, setLatex] = useState(latexTmp.replace(/(HEIGHT_NEUTRAL|HEIGHT_SMALL|HEIGHT_MEDIUM|HEIGHT_LARGE|ZOOM_IN_[123]|ZOOM_OUT_[123]|ZOOM_NEUTRAL)+$/, ''));
    //Zomm in steuert später die Textsize im LaTeX Viewport
    const zoomOptions = ["ZOOM_OUT_3", "ZOOM_OUT_2", "ZOOM_OUT_1" ,"ZOOM_NEUTRAL","ZOOM_IN_1", "ZOOM_IN_2", "ZOOM_IN_3"] as const;
    const heightOptions = ["HEIGHT_NEUTRAL","HEIGHT_SMALL", "HEIGHT_MEDIUM", "HEIGHT_LARGE"] as const;

    const [urlImage, setUrlImage] = useState(imageTmp);
    const [imageValid, setImageValid] = useState(true);
    const [correctAnswer, setCorrectAnswer] = useState(correctAnswerTmp);

    

    const Selectable = ({
      name = "font",
      handlePress = () => {},
      title = "Text",
      isSelected = false,
    }) => {
      return (
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-full h-8 px-2 py-1"
          style={{ backgroundColor: isSelected ? "#3B82F6" : undefined }}
          onPress={handlePress}
        >
          <Icon name={name} size={15} color="white" />
          {isSelected ? (
            <Text className="text-white font-semibold ml-2 mb-[1px]">
              {title}
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    };
    const isImageUrl = (url: string) => {
      return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/.test(url.toLowerCase());
    };

    const [zoom, setZoom] = useState<ZoomOption>(extractZoomFromLatex(latexTmp));
    const [height, setHeight] = useState<HeightOption>(extractHeightFromLatex(latexTmp));
    type ZoomOption = typeof zoomOptions[number];
    type HeightOption = typeof heightOptions[number];

function ZoomHeightControls() {
  

  const changeZoom = (direction: "in" | "out") => {
    const index = zoomOptions.indexOf(zoom);
    if (direction === "in" && index < zoomOptions.length - 1) {
      setZoom(zoomOptions[index + 1]);
    }
    if (direction === "out" && index > 0) {
      setZoom(zoomOptions[index - 1]);
    }
  };

  const changeHeight = (direction: "up" | "down") => {
    const index = heightOptions.indexOf(height);
    if (direction === "up" && index < heightOptions.length - 1) {
      setHeight(heightOptions[index + 1]);
    }
    if (direction === "down" && index > 0) {
      setHeight(heightOptions[index - 1]);
    }
  };

  return (
    <View className="flex-row justify-between items-center rounded-2xl">
      {/* Zoom Controls */}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => changeZoom("out")}
          disabled={zoom === zoomOptions[0]}
        >
          <Icon
            name="search-minus"
            size={20}
            color={zoom === zoomOptions[0] ? "gray" : "white"}
            style={{ padding: 8 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => changeZoom("in")}
          disabled={zoom === zoomOptions[zoomOptions.length - 1]}
        >
          <Icon
            name="search-plus"
            size={20}
            color={zoom === zoomOptions[zoomOptions.length - 1] ? "gray" : "white"}
            style={{ padding: 8 }}
          />
        </TouchableOpacity>
      </View>

      {/* Height Controls */}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => changeHeight("up")}
          disabled={height === heightOptions[heightOptions.length - 1]}
        >
          <Icon
            name="caret-up"
            size={20}
            color={height === heightOptions[heightOptions.length - 1] ? "gray" : "white"}
            style={{ padding: 8 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => changeHeight("down")}
          disabled={height === heightOptions[0]}
        >
          <Icon
            name="caret-down"
            size={20}
            color={height === heightOptions[0] ? "gray" : "white"}
            style={{ padding: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}





    return (
      <View className="w-full ml-1 py-2 ">
        {detailsHidden ? (
          <TouchableOpacity
            className={`w-full items-center justify-between ${typeOfQuestion ? "bg-gray-800" : correctAnswer ? "bg-green-900" : "bg-red-900"} rounded-lg`}
            onPress={() => setDetailsHidden(false)}
          >
            <Text
              className="text-white text-[15px] text-center font-semibold"
              style={{
                paddingTop: 10,
                paddingBottom: dataType !== "text" ? 0 : 10,
              }}
            >
              {text ? text : t("editQuestion.enterQuestion")}
            </Text>
            {dataType === "latex" ? (
              <View className=" w-full   rounded-lg  overflow-hidden "
              >
                  <KaTeXExample
                      formula={latex + zoom + height}
                      />
              </View>
            ) : dataType === "image" ? (
              <View className="w-full   rounded-lg overflow-hidden min-h-10 p-2 items-center px-4">
                {imageValid ? (
                  <Image
                    source={{ uri: urlImage }}
                    style={{
                      width: 200, // feste Breite
                      aspectRatio: 1.5, // Breite / Höhe → z.B. 3:2
                      borderRadius: 10,
                      resizeMode: "contain",
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-red-500 mt-2">
                    {t("editQuestion.invaidImageURL")} {urlImage}
                  </Text>
                )}
              </View>
            ) : null}
          </TouchableOpacity>
        ) : (
          <View
            className={`flex-col w-full items-start justify-between ${typeOfQuestion ? "bg-gray-800" : correctAnswer ? "bg-green-900" : "bg-red-900"} rounded-lg px-4 py-2`}
          >
            <View className="w-full items-center  mb-2"
              style={{
                minHeight: dataType === "text" ? 60 : textVisible ? 140 : 40,
              }}
            >
              <TextInput
                className={`flex-1 w-full bg-gray-900  text-white rounded-lg p-2`}
                placeholder={t("editQuestion.enterQuestion")}
                value={text}
                onChangeText={(text) => setText(text)}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
                style={{
                  minHeight: 60,
                  maxHeight: 60,
                  textAlignVertical: "top",
                }}
              />
              <View className="flex-1 flex-row w-full  justify-between items-center"
              >
                {textVisible && (dataType == "latex" || dataType == "image") ? (
                  <TextInput
                    className="flex-1 w-full bg-gray-900 p-2 text-white rounded-lg mt-2"
                    placeholder={
                      dataType === "latex"
                        ? t("editQuestion.enterLatex")
                        : t("editQuestion.enterImageURL")
                    }
                    value={dataType === "latex" ? latex : urlImage}
                    onChangeText={(text) => {
                      if (dataType === "latex") {
                        setLatex(text);
                      } else if (dataType === "image") {
                        setImageValid(isImageUrl(text));
                        setUrlImage(text);
                      }
                    }}
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={5}
                    style={{
                      minHeight: 80,
                      maxHeight: 80,
                      textAlignVertical: "top",
                    }}
                  />
                ) : null}
                {dataType === "latex" && !textVisible ? (
                  <View className="bg-gray-900 w-full mt-2  rounded-lg overflow-hidden"
                   
                  >
                    <KaTeXExample
                      key={latex + zoom + height}
                      formula={latex}
                      fontSize={returnTextSize(zoom)}
                      height={returnHeight(height)} 
                      />
                    <ZoomHeightControls />
                  </View>
                ) : dataType === "image" && !textVisible ? (
                  <View className="bg-gray-900 w-full mt-2 rounded-lg overflow-hidden min-h-10 p-2 items-center">
                    {imageValid ? (
                      <Image
                        source={{ uri: urlImage }}
                        style={{
                          width: "100%", // feste Breite
                          aspectRatio: 1.5, // Breite / Höhe → z.B. 3:2
                          borderRadius: 10,
                          resizeMode: "contain",
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-red-500 mt-2">
                        {t("editQuestion.invaidImageURL")} {urlImage}
                      </Text>
                    )}
                  </View>
                ) : null}
              </View>
            </View>

            <View className="w-full  flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                <View className="flex-row items-center bg-gray-900 rounded-full h-8 ">
                  <Selectable
                    name="font"
                    title="Text"
                    isSelected={dataType === "text"}
                    handlePress={() => setDataType("text")}
                  />
                  <Selectable
                    name="code"
                    title="LaTeX"
                    isSelected={dataType === "latex"}
                    handlePress={() => setDataType("latex")}
                  />
                  <Selectable
                    name="image"
                    title="Bild"
                    isSelected={dataType === "image"}
                    handlePress={() => setDataType("image")}
                  />
                </View>
                {dataType !== "text" ? (
                  <Icon
                    name={textVisible ? "eye" : "eye-slash"}
                    size={20}
                    color="white"
                    onPress={() => setTextVisible(!textVisible)}
                    style={{ padding: 10 }}
                  />
                ) : null}
              </View>
              <View className="flex-row items-center">
                <Icon
                  name="trash"
                  size={20}
                  color="red"
                  style={{ marginRight: 10, padding: 10 }}
                  onPress={() => {
                    if (typeOfQuestion) {
                    } else {
                      const updatedAnswers = [...questionToEdit.answers];
                      updatedAnswers.splice(itemIndex, 1);
                      setQuestionToEdit({
                        ...questionToEdit,
                        answers: updatedAnswers,
                      });
                    }
                    setDetailsHidden(true);
                  }}
                />
                {!typeOfQuestion && (
                  <ToggleSwitch
                    onToggle={() => setCorrectAnswer(!correctAnswer)}
                    isOn={correctAnswer}
                  />
                )}
                <TouchableOpacity
                  onPress={() => {
                    if (typeOfQuestion) {
                      setImageValid(isImageUrl(urlImage));
                      setQuestionToEdit({
                        ...questionToEdit,
                        question: text,
                        questionLatex: latex + height + zoom,
                        questionUrl: urlImage,
                      });
                      console.log("Latex:", latex + height + zoom);
                    } else {
                      const updatedAnswers = [...questionToEdit.answers];
                      updatedAnswers[itemIndex] = {
                        title: text,
                        latex: latex + height + zoom,
                        image: urlImage,
                      };
                                            console.log("Latex:", latex + height + zoom);

                      setQuestionToEdit({
                        ...questionToEdit,
                        answers: updatedAnswers,
                        answerIndex: correctAnswer
                          ? [...questionToEdit.answerIndex, itemIndex]
                          : questionToEdit.answerIndex.filter(
                              (index: number) => index !== itemIndex
                            ),
                      });
                    }
                    setDetailsHidden(true);
                  }}
                  className="bg-blue-500 ml-2 rounded-lg h-6 w-6 items-center justify-center  flex-row" 
                  style={{
                    height: 20,
                    width : 20,
                  }}
                >
                  <Icon name="check" size={15} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };
export default ContentInput