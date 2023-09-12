import React, { useEffect, useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

// import { CometChat } from "@cometchat-pro/chat";
import { CometChatOutgoingCall } from "@cometchat/chat-uikit-react";
import { CometChatUIKitConstants } from "@cometchat/uikit-resources";

const OutgoingCallDemo = (props) => {
  const [call, setCall] = useState();

  useEffect(() => {
    const uid = "superhero1";

    const callObject = new CometChat.Call(
      uid,
      CometChatUIKitConstants.MessageTypes.audio,
      CometChatUIKitConstants.MessageReceiverType.user
    );
    CometChat.initiateCall(callObject)
      .then((c) => {
        setCall(c);
      })
      .catch(console.log);
  }, []);

  const cancelCall = () => setCall(undefined);

  return call ? (
    <div>
      <CometChatOutgoingCall call={call} onCloseClicked={cancelCall} />
    </div>
  ) : null;
};

export { OutgoingCallDemo };
