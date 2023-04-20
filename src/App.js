import logo from './logo.svg';
import './App.css';
import TaskCreator from './taskCreator';
import Task from './Task';
import LoginBar from './LoginBar';
import { useState } from 'react';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
import TaskList from './TaskList';
let taskData = require("./sampleTaskData.json");
const userDataEndpoint = "https://lighthall-task-app.onrender.com";

function App() {
  // Name and ID of currently logged-in user
  const [userName, setUserName] = useState(""); //placeholder user name
  const [userID, setUserID] = useState(""); //using placeholder ID for testing
  const [editTaskPrompt, setEditTaskPrompt] = useState(<></>);
  const [userTasks, setUserTasks] = useState([]);

  function showEditForm(taskID=null, taskData=null) {
    setEditTaskPrompt(
      <TaskCreator onTaskSaved={taskSaved} onEditCanceled={taskEditCanceled} userID={userID} taskID={taskID} taskData={taskData}/>
    )
  }

  function createNewTask() {
    showEditForm();
  }

  // Make sure to pass this function to the TaskCreator element
  function taskSaved(newTaskData) {
    //Update UI to reflect newly created/edited task
    logTasks();
    // Delete input form component
    setEditTaskPrompt(<></>);
  }

  function taskEditCanceled() {
    setEditTaskPrompt(<></>);
  }

  function loggedIn(data) {
    setUserID(data["id"]);
    setUserName(data["name"]);
    setUserTasks(data["tasks"]);
  }

  function loggedOut() {
    setUserName("");
    setUserID("");
    setUserTasks([]);
    setVisibleTasks([]);
  }

  //GET request for all
  function logTasks() {
    //for testing purposes hardcode user "Seij"
    fetch(`${userDataEndpoint}/user/${userName}`, {
      method: "GET",
      headers: {
        "Accept": "*/*",
        "Connection": "keep-alive",
      },
    }).then((response) => {
      response.json().then(a => {
        console.log(a);
        setUserTasks(a.tasks); //update all tasks for the UI
      })
    });

  }

  }

  return (
    <div className="App">
      { !userID ?
        (<LoginBar onLoggedIn={loggedIn} dataEndpoint={userDataEndpoint} />)
        : (<div>
            Logged in as {userName}
            <button onClick={loggedOut}>Sign Out</button>
          </div>)
      }
      
      <br></br>
      {editTaskPrompt}
      <br></br>

      <button onClick={logTasks}>
      Show All Tasks
      </button>
      <button onClick={createNewTask}>
        + Create New Task
      </button>

      {userID ? (<div>
        <TaskList logTasks={logTasks} userDataEndpoint={userDataEndpoint} userTasks={userTasks}/>
      </div>)
      : 
      (<div>
        Please log in to view and edit your tasks.
      </div>)}

    </div>
  );
}

export default App;
