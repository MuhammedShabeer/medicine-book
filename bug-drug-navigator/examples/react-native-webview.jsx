// npm install react-native-webview
// Android: copy the folder to android/app/src/main/assets/
// iOS: add the folder to the Xcode project as a folder reference
import { Platform } from "react-native";
import { WebView } from "react-native-webview";

const uri = Platform.OS === "android"
  ? "file:///android_asset/bug-drug-navigator/index.html"
  : "bug-drug-navigator/index.html";

export default function BugDrugNavigatorScreen() {
  return (
    <WebView
      source={Platform.OS === "android" ? { uri } : require("./bug-drug-navigator/index.html")}
      originWhitelist={["*"]}
      javaScriptEnabled
      allowFileAccess
      allowingReadAccessToURL="."
      style={{ flex: 1 }}
    />
  );
}
