/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import {
  CometChatConversationsWithMessages,
  CometChatOngoingCall,
  CometChatUIKit,
} from "@cometchat/chat-uikit-react";
import { useEffect, useRef, useState } from "react";
import Login from "./login/Login";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatIncomingCall } from "@cometchat/chat-uikit-react";
import { CometChatMessages } from "@cometchat/chat-uikit-react";
import { CometChatUIKitConstants } from "@cometchat/uikit-resources";

import { getMessageUid } from "./firebase"; // Import the function from firebase.js
import { CometChatCalls } from "@cometchat-pro/web-calls";
// import { OngoingCallDemo } from "./OngoingCallDemo";
// import { OutgoingCallDemo } from "./OutgoingCallDemo";

function App() {
  let uid = new URL(window.location.href).searchParams.get("uid");
  let callType = new URL(window.location.href).searchParams.get("callType");
  let guid = new URL(window.location.href).searchParams.get("guid");
  let sessionid = new URL(window.location.href).searchParams.get("sessionid");
  let receiverType = new URL(window.location.href).searchParams.get(
    "receiverType"
  );
  console.log("session on top", sessionid);

  const [user, setUser] = useState(null);
  const [chatWithUser, setChatWithUser] = useState(null);
  const [chatWithGroup, setChatWithGroup] = useState(null);
  const [getSessionId, setSessionId] = useState();
  // const [getUid, setUid] = useState(uid);
  // const [getGuid, setGuid] = useState(guid);
  const [callObject, setCallObject] = useState(null);
  const [callObject2, setCallObject2] = useState(null);
  const [refreshed, setRefreshed] = useState(false);

  const myElementRef = useRef(null);

  var receiverID = "UID";
  // var callType = CometChat.CALL_TYPE.AUDIO;
  // var receiverType = CometChat.RECEIVER_TYPE.USER;

  useEffect(() => {
    if (uid && callType && receiverType) {
      var call = new CometChat.Call(uid, callType, receiverType);
      console.log("calling", call);
      if (call) {
        setCallObject(call);
      }
    }

    // return () => {
    //   setCallObject(null);
    // };
  }, [uid, callType, receiverType]);

  const acceptCall = async () => {
    console.log("triggerd?????");
    await CometChat.acceptCall(sessionid).then(
      async (call) => {
        // setCallObject(undefined);
        setCallObject2(call);
        console.log("Call accepted successfully:", call);
        var sessionId = call.sessionId;
        console.log("sessionId in start  call", sessionId);
        const authToken = await user.getAuthToken();
        console.log("authToken", authToken);
        let callToken = await CometChatCalls.generateToken(
          sessionid,
          authToken
        );
        console.log("callToken", callToken);
        let isAudioOnly = callType === "audio";
        const callSettings = new CometChatCalls.CallSettingsBuilder()
          .enableDefaultLayout(true)
          .setIsAudioOnlyCall(isAudioOnly)
          .setCallListener(
            new CometChatCalls.OngoingCallListener({
              onUserListUpdated: (userList) => {
                console.log("user list:", userList);
              },
              onCallEnded: () => {
                console.log("Call ended");
              },
              onError: (error) => {
                console.log("Error :", error);
              },
              onMediaDeviceListUpdated: (deviceList) => {
                console.log("Device List:", deviceList);
              },
              onUserMuted: (event) => {
                // This event will work in JS SDK v3.0.2-beta1 & later.
                console.log("Listener => onUserMuted:", {
                  userMuted: event.muted,
                  userMutedBy: event.mutedBy,
                });
              },
              onScreenShareStarted: () => {
                // This event will work in JS SDK v3.0.3 & later.
                console.log("Screen sharing started.");
              },
              onScreenShareStopped: () => {
                // This event will work in JS SDK v3.0.3 & later.
                console.log("Screen sharing stopped.");
              },
              onCallSwitchedToVideo: (event) => {
                // This event will work in JS SDK v3.0.8 & later.
                console.log("call switched to video:", {
                  sessionId: event.sessionId,
                  callSwitchInitiatedBy: event.initiator,
                  callSwitchAcceptedBy: event.responder,
                });
              },
              onUserJoined: (user) =>
                console.log("event => onUserJoined", user),
              onUserLeft: (user) => console.log("event => onUserLeft", user),
            })
          )
          .build();

        const htmlElement = myElementRef.current;
        CometChatCalls.startSession(callToken.token, callSettings, htmlElement)
          .then((response) => {
            console.log("call session success", response);
            setCallObject(undefined);
          })
          .catch((error) => {
            console.log("call session failure", error);
          });
      },
      (error) => {
        console.log("Call acceptance failed with error", error);
      }
    );
  };

  useEffect(() => {
    var listnerID = "UNIQUE_LISTENER_ID";

    CometChatCalls.addCallEventListener(listnerID, {
      onUserJoined: (user) => {
        console.log("user joined:", user);
      },
      onUserLeft: (user) => {
        console.log("user left:", user);
      },
      onUserListUpdated: (userList) => {
        console.log("user list:", userList);
      },
      onCallEnded: () => {
        console.log("Call ended");
      },
      onCallEndButtonPressed: () => {
        console.log("End Call button pressed");
      },
      onError: (error) => {
        console.log("Call Error: ", error);
      },
      onAudioModesUpdated: (audioModes) => {
        console.log("audio modes:", audioModes);
      },
      onUserMuted: (event) => {
        console.log("user muted:", event);
      },
    });

    // CometChat.addCallListener(
    //   listnerID,
    //   new CometChat.CallListener({
    //     onIncomingCallReceived: (call) => {
    //       console.log("Incoming call:", call);
    //       setCallObject(call);

    //       setSessionId(call.getSessionId());
    //     },
    //     onOutgoingCallAccepted: (call) => {
    //       console.log("Outgoing call accepted:", call);
    //     },
    //     onOutgoingCallRejected: (call) => {
    //       console.log("Outgoing call rejected:", call);
    //     },
    //     onIncomingCallCancelled: (call) => {
    //       console.log("Incoming call calcelled:", call);
    //     },
    //     onCallEndedMessageReceived: (call) => {
    //       console.log("CallEnded Message:", call);
    //     },
    //   })
    // );
    return () => CometChatCalls.removeCallEventListener("UNIQUE_ID");
  }, []);

  const cancelCall = async () => {
    setCallObject(undefined);
    console.log("rejected?????????????????????????????????????????");
    var status = CometChat.CALL_STATUS.REJECTED;
    setCallObject(undefined);

    CometChat.rejectCall(sessionid).then(
      (call) => {
        console.log("Call rejected successfully", call);
      },
      (error) => {
        console.log("Call rejection failed with error:", error);
      }
    );
  };
  // const cancelCall = () => setCall(undefined);
  // useEffect(() => {
  //   console.log("triggering???????");
  //   const broadcastChannel = new BroadcastChannel("myChannel");

  //   broadcastChannel.onmessage = (event) => {
  //     console.log("triggering2???????");

  //     // Handle messages received from the service worker
  //     console.log("broadcastChannel", event);
  //     const tempData = event.data;
  //     console.log("Received message from service worker:", tempData);

  //     // Access the uid and guid data as needed
  //     const receivedUid = tempData.uid;
  //     const receivedGuid = tempData.guid;

  //     const messageData = tempData.messageData;
  //     setCallObject(messageData);
  //     console.log("receivedUid", receivedUid);
  //     console.log("receivedGuid", receivedGuid);
  //     console.log("messageData in ", messageData);
  //     // console.log("receivedGuid", receivedGuid);
  //     // Update state with the received data
  //   };

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     broadcastChannel.close();
  //   };
  // }, []);

  // useEffect(() => {
  //   navigator.serviceWorker.addEventListener("notificationclick", (event) => {
  //     console.log("after clicked>>??");
  //     // Retrieve the associated messageData from the clicked notification
  //     const messageData = JSON.parse(event.notification.data);
  //     // Handle the messageData as needed
  //     console.log("Received messageData:", messageData);
  //     // setCallObject(messageData);

  //     // Now you can work with the messageData in your React component
  //   });
  // }, []);
  // console.log("UID<><>>>>>>>>>>>>>", getUid);
  useEffect(() => {
    if (guid && !uid) {
      // console.log("currentOpenChat group", getUid);
      CometChat.getGroup(guid)
        .then((group) => {
          if ("guid" in group) {
            setChatWithGroup(group);
          }
        })
        .catch((group) => {
          console.log("group does not exit", group);
        });
    }

    if (uid && !guid) {
      CometChat.getUser(uid)
        .then((user) => {
          console.log("user<>qwertyuiop", user);
          if ("uid" in user) {
            setChatWithUser(user);
          }
        })
        .catch((user) => {
          console.log("user does not exit", user);
        });
    }

    // // Cleanup function
    // return () => {
    //   // setUid(null);
    //   // setGuid(null);
    // };
  }, [guid, uid]);

  useEffect(() => {
    (async () => {
      try {
        setUser(await CometChat.getLoggedinUser());
      } catch (error) {
        console.log(error);
      }
    })();
  }, [setUser]);

  const logout = () => {
    CometChatUIKit.logout().then(
      () => {
        //Logout completed successfully
        console.log("Logout completed successfully");
        setUser(null);
      },
      (error) => {
        //Logout failed with exception
        console.log("Logout failed with exception:", { error });
      }
    );
  };

  const onDecline = () => {
    console.log("first", refreshed);
    setRefreshed(true);
    if (refreshed) {
      console.log("sls");
      cancelCall();
    }
  };
  function getChatsModule() {
    return (
      <>
        <div style={{ height: "100vh" }} ref={myElementRef} id='ELEMENT_ID'>
          {chatWithGroup ? (
            <>
              <CometChatMessages group={chatWithGroup} key={guid} />

              {callObject && (
                <CometChatIncomingCall
                  call={callObject}
                  onAccept={() => acceptCall(sessionid)}
                  // onDecline={cancelCall}
                  // onDecline={() => cancelCall(sessionid)}
                  // onError={callObject}
                />
              )}
            </>
          ) : (
            // <CometChatMessages user={chatWithUser} />
            <>
              <CometChatMessages user={chatWithUser} key={uid} />
              {callObject && (
                <CometChatIncomingCall
                  call={callObject}
                  onAccept={() => acceptCall(sessionid)}
                  // onDecline={onDecline}
                  onClick={cancelCall}
                  // onDecline={() => cancelCall(sessionid)}
                  // onError={callObject}
                />
              )}
              {/* {callObject2 && <CometChatOngoingCall sessionID={sessionid} />} */}

              {/* <OngoingCallDemo /> */}
            </>
          )}
          {/* <div ref={myElementRef} id='ELEMENT_ID'>
            
          </div> */}
        </div>
      </>
    );
  }
  function getHome() {
    return (
      <>
        <div className='App' style={{ height: "100vh" }}>
          {user ? (
            <>
              <button colorScheme='red' onClick={() => logout()}>
                Logout
              </button>

              <CometChatConversationsWithMessages />
              {/* {callObject && <CometChatIncomingCall call={callObject} />} */}
              {/* <CometChatIncomingCall
                call={callObject2}
                onAccept={acceptCall}
                onDecline={cancelCall}
              /> */}
              {/* <OngoingCallDemo /> */}
              {/* <OutgoingCallDemo /> */}
            </>
          ) : (
            <Login setUser={setUser} />
          )}
          {/* <CometChatUsersWithMessages /> */}
        </div>
      </>
    );
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route path='/' element={getHome()}></Route>
            <Route path='chats' element={getChatsModule()} />
          </Route>
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
