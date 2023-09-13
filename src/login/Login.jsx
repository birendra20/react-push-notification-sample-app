import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import React, { useState } from "react";
import IronManAvatar from "../assets/ironman_avatar.png";
import CyclopsAvatar from "../assets/cyclops_avatar.png";
import SpidermanAvatar from "../assets/spiderman_avatar.png";
import CaptainAmericaAvatar from "../assets/captainamerica_avatar.png";
import { defaultUserBtnsContainerStyle } from "./style";

export default function Login(props) {
  const [phone, setPhone] = useState("");

  const setUser = props.setLoggedInUser;
  console.log("props", props);
  const handleSubmit = (e) => {
    e.preventDefault();

    var UID = phone;
    var authKey = "76cf7a8e05c8b3e3751912cebfa80f9e037d7318";

    CometChatUIKit.login(UID, authKey).then(
      (User) => {
        setUser(User);
      },
      (error) => {
        console.log("Login failed with exception:", { error });
      }
    );
  };

  async function login(uid) {
    try {
      CometChatUIKit.login(uid)?.then((loggedInUser) => {
        console.log("Login successful, loggedInUser:", loggedInUser);
        setUser(loggedInUser);
      });
    } catch (error) {
      console.log("login failed", error);

      console.log(error);
    }
  }
  const defaultUsers = [
    {
      name: "Iron Man",
      uid: "superhero1",
      avatar: IronManAvatar,
    },
    {
      name: "Captain America",
      uid: "superhero2",
      avatar: CaptainAmericaAvatar,
    },
    {
      name: "Spiderman",
      uid: "superhero3",
      avatar: SpidermanAvatar,
    },
    {
      name: "Cyclops",
      uid: "superhero5",
      avatar: CyclopsAvatar,
    },
  ];

  function getUserBtnWithKeyAdded({ name, uid, avatar }) {
    return (
      <button key={uid} onClick={() => login(uid)}>
        <img
          style={{
            width: "40px",
            height: "40px",
          }}
          src={avatar}
          alt={`${name}'s avatar`}
        />
        <div>
          <p>{name} </p>
          <p>{uid}</p>
        </div>
      </button>
    );
  }

  return (
    <div id='login'>
      <form onSubmit={handleSubmit}>
        <p fontSize='3xl' fontWeight='bolder'>
          Login
        </p>
        <p fontSize='1xl' fontWeight='bolder'>
          Phone Number
        </p>{" "}
        <input
          type='tel'
          required
          name='phone'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />{" "}
        <br />
        <button>Login</button>
      </form>

      <div style={defaultUserBtnsContainerStyle()}>
        {defaultUsers.map(getUserBtnWithKeyAdded)}
      </div>
    </div>
  );
}
