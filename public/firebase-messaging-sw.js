/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// required to setup background notification handler when browser is not in focus or in background and
// In order to receive the onMessage event,  app must define the Firebase messaging service worker
// self.importScripts("localforage.js");

importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js"
);

// Set Firebase configuration, once available
self.addEventListener("fetch", () => {
  try {
    const urlParams = new URLSearchParams(location.search);
    self.firebaseConfig = Object.fromEntries(urlParams);
  } catch (err) {
    console.error("Failed to add event listener", err);
  }
});
// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

// Initialize Firebase app
firebase.initializeApp(self.firebaseConfig || defaultConfig);
let messaging;
try {
  messaging = firebase.messaging();
} catch (err) {
  console.error("Failed to initialize Firebase Messaging", err);
}

// To display background notifications
if (messaging) {
  try {
    messaging.onBackgroundMessage(async (payload) => {
      console.log("Received background message: ", payload);

      const messageData = JSON.parse(payload.data.message);

      if (self.clients && self.clients.length > 0) {
        self.clients[0].postMessage(messageData);
      }
      console.log("messageData", messageData);
      const uid = messageData.sender;
      const guid = messageData?.data?.entities?.receiver?.entity?.guid;
      const callType = messageData.type;
      const receiverType = messageData.receiverType;
      const sessionid = messageData?.data?.entities?.on?.entity?.sessionid;
      const myIcon = messageData?.data?.entities?.sender?.entity?.avatar;
      // localStorage.setItem("uid", uid);
      // localStorage.setItem("guid", guid);

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        data: JSON.stringify(messageData),
        // icon: "https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/cd3drvx35hfhfb1mswg4",
        icon: myIcon,
        actions: [
          {
            action: "reply",
            type: "text",
            title: "Reply",
            icon: myIcon,
          },
        ],
      };
      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );

      // Define the notification click handler directly as a function
      self.addEventListener("notificationclick", (event) => {
        console.log("clicked??????????????????/", event);
        event.notification.close(); // Close the notification

        if (
          messageData.category === "call" ||
          callType === "audio" ||
          callType === "video" ||
          sessionid
        ) {
          event.waitUntil(
            clients.openWindow(
              `http://localhost:3000/chats?uid=${uid}&callType=${callType}&receiverType=${receiverType}&sessionid=${sessionid}`
            )
          );
        } else {
          if (guid) {
            event.waitUntil(
              clients.openWindow(`http://localhost:3000/chats?guid=${guid}`)
            );
          } else {
            event.waitUntil(
              clients.openWindow(`http://localhost:3000/chats?uid=${uid}`)
            );
          }
        }
      });

      //              `http://localhost:3000/chats?openChatwith=${userId}`

      // var notification = new Notification(
      //   notificationTitle,
      //   notificationOptions
      // );
      // notification.onclick = () =>
      //   function () {
      //     window.open("https://www.google.com/");
      //   };
    });
  } catch (err) {
    console.log(err);
  }
}
