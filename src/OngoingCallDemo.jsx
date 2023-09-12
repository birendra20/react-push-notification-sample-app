import React, { useEffect, useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

// import { CometChat } from "@cometchat-pro/chat";
import { CometChatOngoingCall } from "@cometchat/chat-uikit-react";
import { CometChatUIKitConstants } from "@cometchat/uikit-resources";

const OngoingCallDemo = (props) => {
  const [call, setCall] = useState();

  useEffect(() => {
    const uid = "superhero2";

    const callObject = new CometChat.Call(
      uid,
      CometChatUIKitConstants.MessageTypes.audio,
      CometChatUIKitConstants.MessageReceiverType.user
    );
    CometChat.initiateCall(callObject)
      .then((initiatedCall) => {
        CometChat.startCall(callObject)
          .then((c) => {
            setCall(c);
          })
          .catch(console.log);
      })
      .catch(console.log);
  }, []);

  return call ? (
    <div>
      <CometChatOngoingCall sessionID={call.getSessionId()} />
    </div>
  ) : null;
};

export { OngoingCallDemo };
