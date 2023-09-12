import { CometChat } from "@cometchat-pro/chat";
import React, { useState } from "react";

export default function Register(props) {
  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const setUser = props.setUser;

  const handleSubmit = (e) => {
    e.preventDefault();

    let authKey = "76cf7a8e05c8b3e3751912cebfa80f9e037d7318";
    var uid = phone;
    var name = userName + " (" + phone + ")";

    var user = new CometChat.User(uid);

    user.setName(name);

    CometChat.createUser(user, authKey).then(
      (user) => {
        console.log("user created", user);

        // login
        var UID = phone;
        var authKey = "76cf7a8e05c8b3e3751912cebfa80f9e037d7318";

        CometChat.login(UID, authKey).then(
          (User) => {
            console.log("Login Successful:", { User });
            // User loged in successfully.
            setUser(User);
          },
          (error) => {
            console.log("Login failed with exception:", { error });
            // User login failed, check error and take appropriate action.
          }
        );
      },
      (error) => {
        console.log("error", error);
      }
    );
  };

  return (
    <div id='register'>
      <form onSubmit={handleSubmit}>
        <p fontSize='3xl' fontWeight='bolder'>
          Register
        </p>
        {/* phone */}
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
        {/* user name */}
        <p fontSize='1xl' fontWeight='bolder'>
          User Name
        </p>{" "}
        <input
          type='name'
          required
          name='userName'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />{" "}
        <br />
        <button mt={2} type='submit'>
          Register
        </button>
      </form>
    </div>
  );
}
