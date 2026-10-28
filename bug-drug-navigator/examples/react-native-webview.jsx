// React Native — load the bundled navigator from local files.
// npm install react-native-webview react-native-fs
//
// Android: copy the whole "bug-drug-navigator" folder to
//          android/app/src/main/assets/bug-drug-navigator/
// iOS:     drag the "bug-drug-navigator" folder into Xcode and choose
//          "Create folder references" (blue folder), target = your app.
import React from "react";
import { Platform } from "react-native";
import { WebView } from "react-native-webview";
import RNFS from "react-native-fs";

const folder = Platform.OS === "android"
  ? "file:///android_asset/bug-drug-navigator"
  : "file://" + RNFS.MainBundlePath + "/bug-drug-navigator";

export default function BugDrugNavigatorScreen() {
  return (
    <WebView
      source={{ uri: folder + "/index.html" }}
      originWhitelist={["*"]}
      javaScriptEnabled
      allowFileAccess
      allowFileAccessFromFileURLs
      allowingReadAccessToURL={folder}   // iOS: lets index.html load css/ and js/
      style={{ flex: 1 }}
    />
  );
}
