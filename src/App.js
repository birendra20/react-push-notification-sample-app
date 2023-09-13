/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import "./App.css";
import {
  CometChatConversationsWithMessages,
  CometChatUIKit,
} from "@cometchat/chat-uikit-react";
import { useEffect, useRef, useState } from "react";
import Login from "./login/Login";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatIncomingCall } from "@cometchat/chat-uikit-react";
import { CometChatMessages } from "@cometchat/chat-uikit-react";
import { CometChatUIKitConstants } from "@cometchat/uikit-resources";

import { CometChatCalls } from "@cometchat-pro/web-calls";
import { useQueryParams } from "./Test";
// import { OngoingCallDemo } from "./OngoingCallDemo";
// import { OutgoingCallDemo } from "./OutgoingCallDemo";

function App() {
  // let uid = new URL(window.location.href).searchParams.get("uid");
  // let callType = new URL(window.location.href).searchParams.get("callType");
  // let guid = new URL(window.location.href).searchParams.get("guid");
  // let sessionid = new URL(window.location.href).searchParams.get("sessionid");
  // let receiverType = new URL(window.location.href).searchParams.get(
  //   "receiverType"
  // );
  const queryParams = useQueryParams();
  // Extract specific query parameters from queryParams object
  let { uid, callType, guid, sessionid, receiverType } = queryParams;
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [chatWithUser, setChatWithUser] = useState(null);
  const [chatWithGroup, setChatWithGroup] = useState(null);

  const [callObject, setCallObject] = useState(null);
  const [homeSessionId, setHomeSessionId] = useState(null);
  const navigate = useNavigate();
  const myElementRef = useRef(null);
  const refCount = useRef(0);
  let isCallEnded = false;

  useEffect(() => {
    if (uid && callType && receiverType) {
      var call = new CometChat.Call(uid, callType, receiverType);
      if (call) {
        setCallObject(call);
      }
    }

    return () => {
      setCallObject(null);
    };
  }, [uid, callType, receiverType]);

  const acceptCall = async (sessionid) => {
    await CometChat.acceptCall(sessionid).then(
      async (call) => {
        setCallObject(null);
        console.log("Call accepted successfully:", call);
        let CurrentSessionId = call.sessionId;
        const authToken = await loggedInUser.getAuthToken();
        let callToken = await CometChatCalls.generateToken(
          CurrentSessionId,
          authToken
        );
        let isAudioOnly = callType === "audio";
        const callSettings = new CometChatCalls.CallSettingsBuilder()
          .enableDefaultLayout(true)
          .setIsAudioOnlyCall(isAudioOnly)
          .setCallListener(
            new CometChatCalls.OngoingCallListener({
              onUserListUpdated: (userList) => {
                console.log("user list:", userList);
              },

              onCallEndButtonPressed: () => {
                isCallEnded = true;
                console.log("clicked", isCallEnded);
                CometChatCalls.endSession();
              },
              onCallEnded: () => {
                console.log("Call ended");
                if (isCallEnded) {
                  console.log("clilcked in on");
                  CometChat.endCall();
                } else {
                  isCallEnded = false;
                  CometChatCalls.endSession();
                }
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
              onUserLeft: (user) => {
                console.log("event => onUserLeft", user);
                // console.log(loggedInUser);
                // if (user.uid === loggedInUser.uid) {
                //   navigate({
                //     pathname: "/",
                //   });
                // }
              },
            })
          )
          .build();

        const htmlElement = myElementRef.current;
        CometChatCalls.startSession(callToken.token, callSettings, htmlElement)
          .then((response) => {
            console.log("call session success", response);
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

    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onIncomingCallReceived: (call) => {
          console.log("Incoming call:", call);
          setHomeSessionId(call.sessionId);
          setCallObject(call);
        },
        onOutgoingCallAccepted: (call) => {
          console.log("Outgoing call accepted:", call);
        },
        onOutgoingCallRejected: (call) => {
          console.log("Outgoing call rejected:", call);
        },
        onIncomingCallCancelled: (call) => {
          console.log("Incoming call calcelled:", call);
        },
        onCallEndedMessageReceived: (call) => {
          console.log("CallEnded Message:", call);
        },
      })
    );

    return () => {
      CometChat.endCall();
      CometChat.removeCallListener(sessionid);
      CometChatCalls.removeCallEventListener(sessionid);
      refCount.current = 0;
    };
  }, []);
  const cancelCall = async (sessionid) => {
    // setCallObject(undefined);
    console.log("rejected?????????????????????????????????????????");
    var status = CometChat.CALL_STATUS.REJECTED;
    setCallObject(undefined);

    CometChat.rejectCall(sessionid, status).then(
      (call) => {
        console.log("Call rejected successfully", call);
      },
      (error) => {
        console.log("Call rejection failed with error:", error);
      }
    );
  };

  useEffect(() => {
    if (guid && !uid) {
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
          if ("uid" in user) {
            setChatWithUser(user);
          }
        })
        .catch((user) => {
          console.log("user does not exit", user);
        });
    }
  }, [guid, uid]);

  useEffect(() => {
    (async () => {
      try {
        setLoggedInUser(await CometChat.getLoggedinUser());
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const logout = () => {
    CometChatUIKit.logout().then(
      () => {
        //Logout completed successfully
        console.log("Logout completed successfully");
        setLoggedInUser(null);
      },
      (error) => {
        //Logout failed with exception
        console.log("Logout failed with exception:", { error });
      }
    );
  };

  function IncrementCount() {
    refCount.current = refCount.current + 1;
  }

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
                />
              )}
            </>
          ) : (
            <>
              {chatWithUser && (
                <CometChatMessages user={chatWithUser} key={uid} />
              )}
              {callObject && (
                <CometChatIncomingCall
                  call={callObject}
                  onAccept={() => acceptCall(sessionid)}
                  onDecline={(e) => {
                    IncrementCount();

                    if (refCount.current > 2) {
                      cancelCall();
                    }
                  }}
                />
              )}
            </>
          )}
        </div>
      </>
    );
  }

  function getHome() {
    return (
      <>
        <div
          className='App'
          style={{ height: "100vh" }}
          ref={myElementRef}
          id='ELEMENT_ID'
        >
          {loggedInUser ? (
            <>
              <button colorScheme='red' onClick={() => logout()}>
                Logout
              </button>

              <CometChatConversationsWithMessages />
              {/* {callObject && <CometChatIncomingCall call={callObject} />} */}
              {callObject && (
                <CometChatIncomingCall
                  call={callObject}
                  onAccept={() => acceptCall(homeSessionId)}
                />
              )}
            </>
          ) : (
            <Login setLoggedInUser={setLoggedInUser} />
          )}
          {/* <CometChatUsersWithMessages /> */}
        </div>
      </>
    );
  }
  return (
    <>
      <Routes>
        <Route path='/'>
          <Route path='/' element={getHome()}></Route>
          <Route path='chats' element={getChatsModule()} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

export default App;
