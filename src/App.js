import logo from './logo.svg';
import './App.css';
import TaskCreator from './taskCreator';
import { useState } from 'react';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
let taskData = require("./sampleTaskData.json");
const userDataEndpoint = "https://lighthall-task-app.onrender.com";

function App() {
  // ID of currently logged-in user
  const [userName, setUserName] = useState("user1");
  const [userID, setUserID] = useState(null); //using placeholder ID of 0 for testing
  const [userTasks, setUserTasks] = useState([]);

  // Make sure to pass this function to the TaskCreator element
  function SaveNewTask(newTaskData) {
    //Store new task data on the backend
    newTaskData["userId"] = userID;
    fetch(userDataEndpoint + "/task", {
      method: "POST",
      task: newTaskData
    }).then(response => {
      console.log(response);
      response.json().then((r) => console.log(r));
    })
    
  }

  //debug function
  function logTasks() {
    fetch(userDataEndpoint + "/user", {
      method: "GET",
      username: userName
    }).then((response) => {
      response.json().then(a => {
        console.log(a);
      })
    })
  }

  //debug function
  function registerUser() {
    fetch(userDataEndpoint + "/user", {
      method: "POST",
      body: JSON.stringify({User: {name: userName}})
    }).then((response) => {
      console.log("response:");
      console.log(response);
      response.json().then(a => {
        console.log(a);
      })
    })
  }

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
