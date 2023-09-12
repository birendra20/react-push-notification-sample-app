import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UIKitSettingsBuilder } from "@cometchat/uikit-shared";
import { CometChatConstants } from "./const";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import firebaseInitialize from "./firebase";
import { CometChatCalls } from "@cometchat-pro/web-calls";

(async () => {
  const uiKitSettings = new UIKitSettingsBuilder()
    .setAppId(CometChatConstants.appId)
    .setRegion(CometChatConstants.region)
    .setAuthKey(CometChatConstants.authKey)
    .subscribePresenceForFriends()
    .build();

  const callAppSetting = new CometChatCalls.CallAppSettingsBuilder()
    .setAppId(CometChatConstants.appId)
    .setRegion(CometChatConstants.region)
    .build();

  try {
    await CometChatUIKit.init(uiKitSettings);
    await CometChatCalls.init(callAppSetting);
    console.log("Initialization completed successfully");
    firebaseInitialize();

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
    askPermission();
  } catch (error) {
    console.log("Initialization failed with error:", error);
  }
})();

if ("serviceWorker" in navigator) {
  console.log("serviceWorker");
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")

    .then(function (registration) {
      console.log("registration", registration);
      console.log("Registration succlgcessful, scope is:", registration.scope);
      // navigator.serviceWorker.addEventListener("message", (event) => {
      //   // Handle the message (payload) received from the service worker
      //   const payload = event.data;

      //   let temporData = JSON.parse(payload.data.message);
      //   console.log("Received message from service worker:", temporData);

      //   // You can now use the payload data in your React component
      // });
    })
    .catch((error) => console.log("Registration error", error));
}

async function askPermission() {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    }
  });
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
