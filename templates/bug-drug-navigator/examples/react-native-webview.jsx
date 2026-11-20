// Hulool mobile (React Native). npm install react-native-webview react-native-fs
// Android: copy the "spectra" folder to android/app/src/main/assets/spectra/
// iOS:     drag the "spectra" folder into Xcode → "Create folder references" (blue folder).
import React, { useRef } from "react";
import { Platform } from "react-native";
import { WebView } from "react-native-webview";
import RNFS from "react-native-fs";

const folder = Platform.OS === "android"
  ? "file:///android_asset/spectra"
  : "file://" + RNFS.MainBundlePath + "/spectra";

export default function SpectraScreen({ user, sendToHulool }) {
  const web = useRef(null);
  // identity is available before any Spectra script runs
  const boot = `window.SPECTRA_CONFIG = { analytics: {
      enabled: true, localLog: true,
      userId: ${JSON.stringify(user.staffCode)}, role: ${JSON.stringify(user.role)},
      site: ${JSON.stringify(user.site)}, appVersion: ${JSON.stringify(user.appVersion)} } }; true;`;

  return (
    <WebView
      ref={web}
      source={{ uri: folder + "/index.html" }}
      originWhitelist={["*"]}
      javaScriptEnabled
      domStorageEnabled
      allowFileAccess
      allowFileAccessFromFileURLs
      allowingReadAccessToURL={folder}            // iOS: lets index.html load css/ and js/
      injectedJavaScriptBeforeContentLoaded={boot}
      onMessage={(e) => {
        let m; try { m = JSON.parse(e.nativeEvent.data); } catch { return; }
        if (m.source !== "spectra") return;
        if (m.type === "event") sendToHulool(m.event); // batch + POST with the app's auth token
      }}
      style={{ flex: 1 }}
    />
  );
}
// Usage panel: web.current.injectJavaScript("Spectra.analytics.openPanel(); true;");
// Content editor — SYSTEM ADMINISTRATORS ONLY (after Hulool login confirms the role; the server enforces it on publish):
//   if (user.role === "sysadmin") web.current.injectJavaScript(
//     `Spectra.admin.grant(${JSON.stringify({ role: "sysadmin", user: user.staffCode, token: user.token })}); true;`);
