import logo from './logo.svg';
import './App.css';
import TaskCreator from './taskCreator';
import { useState } from 'react';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
let taskData = require("./sampleTaskData.json");
const userDataEndpoint = "https://lighthall-task-app.onrender.com";

function App() {
  // Name and ID of currently logged-in user
  const [userName, setUserName] = useState("user1"); //placeholder user name
  const [userID, setUserID] = useState(null); //using placeholder ID of 0 for testing

  // Make sure to pass this function to the TaskCreator element
  function SaveNewTask(newTaskData) {
    // add user ID to task data
    newTaskData["userId"] = userID;
    // Store new task data on the backend
    fetch(userDataEndpoint + "/task", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "task": newTaskData
      })
    }).then(response => {
      console.log(response);
      //TODO: error handling
    })
    
  }

  //debug function
  function logTasks() {

    fetch(`https://lighthall-task-app.onrender.com/user/${userName}`, {
      method: "GET",
    }).then((response => {
      response.json().then((responseData) => {
        //
        console.log(responseData);
      })
    }))

  }

  //debug function
  function registerUser() {
    fetch("https://lighthall-task-app.onrender.com/user", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      "body": JSON.stringify({
        "user": {
          "name": userName
        }
      })
      
    }).then((response) => {
      console.log(response);
      response.json().then(jsonData => {
        if(response["status"] === 201) {
          setUserID(jsonData["id"]);
        }
        console.log(jsonData);
        setUserID(jsonData["id"]);
      })
    })
  }

  useEffect(() => {
    fetch("https://lighthall-task-app.onrender.com/user", {
      method: "GET",
    }).then((response => {
      response.json().then((responseData) => {
        //
        console.log(responseData);
      })
    }))
  }, [userID]);

  return (
    <div className="App">
      <br></br>
      <TaskCreator onTaskCreated={SaveNewTask}/>
      <br></br>

      <button onClick={registerUser}>
        a
      </button>
      <button onClick={logTasks}>
        b
      </button>
    </div>
  );
}

export default App;
