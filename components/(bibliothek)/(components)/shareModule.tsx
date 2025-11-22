import { View, TouchableOpacity, ToastAndroid } from 'react-native';
import React from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import Icon from 'react-native-vector-icons/FontAwesome5';

/**
This component enables user to share their module with a link
*/
const ShareModuleIcon = ({
    moduleID
}: {
    moduleID: string;
}) => {
    // Generate a web-based or app-based deep link
    const baseUrl = 'https://qready-app.de/deeplinkButton.html';
    const isApp = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
    const appDeepLink = Linking.createURL(`deeplink`, { queryParams: { moduleID } }); // App-based deep link
    const deepLink = `${baseUrl}?deeplink=${encodeURIComponent(appDeepLink)}`; // Web-based link with deep link as a parameter

    console.log("Deep Link:", deepLink);

    const handleCopyToClipboard = async () => {
        try {
            // Copy the deep link to the clipboard
            await Clipboard.setStringAsync(deepLink);

            // Show a toast message to confirm the action
            ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT);
        } catch (error) {
            console.error('Error while copying to clipboard:', error);
        }
    };

    return (
        <TouchableOpacity
            className="pr-[2px] bg-gray-800 border-gray-700 border-[1px] rounded-full h-10 w-10 items-center justify-center"
            onPress={handleCopyToClipboard}
        >
            <Icon name="share-alt" size={20} color="white" />
        </TouchableOpacity>
    );
};



export default ShareModuleIcon;