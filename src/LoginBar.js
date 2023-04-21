import { useEffect, useState } from "react";
import Loading from "./Loading";
import { database } from "./firebaseData/firebase";
import { ref, get, push, child, update } from "firebase/database";

export default function LoginBar({
  onLoggedIn,
  dataEndpoint,
  setUserDataLS,
  userDataLS,
}) {
  const [userName, setUserName] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  async function getUserData() {

    const udata = await get(ref(database, `/user/` + userName)).then((snapshot) => {
      if(snapshot.exists()) {
        if(snapshot.val()) {
          const userID = snapshot.val()["id"];
          const tasks = snapshot.val()["tasks"];
          return {id: userID, tasks: tasks};
        }
        return null;
      }
    })
    if(udata)
      return udata;

    console.log("why");

    // user does not exist yet; must create
    const newUserID = push(child(ref(database), "user")).key;
    console.log(newUserID);
    console.log('what');
    const userUpdate = {};
    userUpdate["/user/" + userName] = {
      "user": userName,
      "id": newUserID,
      "tasks": []
    };
    update(ref(database), userUpdate);
    console.log("a");
    return {id: newUserID, tasks: []};

    console.log("llamada")
    let response1 = await fetch(`${dataEndpoint}/user/${userName}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Connection: "keep-alive",
      },
    });

    if (response1["status"] === 200) {
      // User already exists
      const data = await response1.json().then((jsonData) => {
        const userID = jsonData["id"];
        const tasks = jsonData["tasks"];
        return { id: userID, tasks: tasks };
      });
      return data;
    } else {
      // Must register user
      console.log(userName);
      let response2 = await fetch(`${dataEndpoint}/user`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Connection: "keep-alive",
        },
        body: JSON.stringify({
          user: {
            name: userName,
          },
        }),
      });

      if (response2["status"] === 201) {
        // New user created
        const responseData2 = await response2.json().then((jsonData) => {
          const userID = jsonData["id"];
          const tasks = [];
          return { id: userID, tasks: tasks };
        });
        return responseData2;
      }
    }
    return null;
  }

  async function logInButtonPressed() {
    if (userName !== "") {
      setIsLoadingLogin(true);
      const userData = await getUserData();
      console.log(userData);
      setIsLoadingLogin(true);
      if (userData) {
        onLoggedIn({
          id: userData["id"],
          name: userName,
          tasks: userData["tasks"],
        });
        setUserDataLS(userName);
      } else setStatusMsg("An unknown error has occurred");
    }
  }

  useEffect(() => {
    if (userDataLS && userDataLS !== "") {
      setUserName(userDataLS);
      if (userName !== "") {
        getUserData();
        logInButtonPressed();
        console.log("a");
      }
    }
  }, [userDataLS, userName]);

  return (
    <div className="log-in-bar">
      {isLoadingLogin ? (
        <Loading />
      ) : (
        <>
          <div className="loginBarContainer">
            <input
              type="text"
              className="username-field"
              value={userName}
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={logInButtonPressed}>Log In</button>
          </div>
          <div>{statusMsg}</div>
        </>
      )}
    </div>
  );
}
