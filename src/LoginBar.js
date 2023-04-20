import { useState } from "react"

export default function LoginBar({onLoggedIn, dataEndpoint}) {
    const [userName, setUserName] = useState("");
    const [statusMsg, setStatusMsg] = useState("");

    async function getUserData() {
        let response1 = await
            fetch(`${dataEndpoint}/user/${userName}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Connection": "keep-alive"
                }
            });

        if(response1["status"] === 200) {
            // User already exists
            const data = await response1.json().then(jsonData => {
                const userID = jsonData["id"];
                const tasks = jsonData["tasks"];
                return {"id":userID, "tasks":tasks};
            })
            return data;
        }
        else {
            // Must register user
            console.log(userName);
            let response = await (
                fetch(`${dataEndpoint}/user`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Connection": "keep-alive"
                    },
                    body: JSON.stringify({
                        "user": {
                          "name": userName
                        }
                    })
                })
            ).then((r) => {return r.json()});
            if(response["status"] === 201) {
                // New user created
                const userID = response["id"];
                const tasks = [];
                return {"id":userID, "tasks":tasks};
            }
        }
        return null;
    }

    async function logInButtonPressed() {
        console.log("aaaaaa");
        if(userName !== "") {
            const userData = await getUserData();
            console.log(userData);
            if(userData)
                onLoggedIn({"id":userData["id"], "name":userName, "tasks":userData["tasks"]});
            else
                setStatusMsg("An unknown error has occurred");
        }
    }

    return(
        <div>
            <div>
                <input type="text" value={userName}
                placeholder="Username"
                onChange={e => setUserName(e.target.value)} />
                <button onClick={logInButtonPressed}>
                    Log In
                    
                </button>
            </div>
            <div>
                {statusMsg}
            </div>
            

        </div>
    )
}