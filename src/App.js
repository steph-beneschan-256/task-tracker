import logo from './logo.svg';
import './App.css';
import TaskCreator from './taskCreator';
import Task from './Task';
import { useState } from 'react';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
let taskData = require("./sampleTaskData.json");
const userDataEndpoint = "https://lighthall-task-app.onrender.com";

function App() {
  // Name and ID of currently logged-in user
  const [userName, setUserName] = useState("user1"); //placeholder user name
  const [userID, setUserID] = useState("e3ae3c35-b65b-48db-b9f3-e7fa63895282"); //using placeholder ID of 0 for testing
  const [editTaskPrompt, setEditTaskPrompt] = useState(<></>);
  const [userTasks, setUserTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState([]); //visible tasks displayed on screen, should be pre-sorted

  function showEditForm(taskID=null, taskData=null) {
    setEditTaskPrompt(
      <TaskCreator onTaskSaved={taskSaved} onEditCanceled={taskEditCanceled} userID={userID} taskID={taskID} taskData={taskData}/>
    ) 
  }

  function createNewTask() {
    showEditForm();
  }

  function debugEditTask() {
    const taskID = "95b4a972-beb7-49d5-8eab-d10ac45e75c6";
    const taskData = {
      "title": "placeholder task",
      "description": "placeholder description",
      "completionStatus": "inProgress",
      "dueDate": "2024-04-21"
    }
    showEditForm(taskID, taskData);
  }

  function editTask(taskID) {
    //TODO: read taskData using taskID
    // For now, use placeholder task to represent an existing task that's being edited
    const taskData = {
      "title": "placeholder task",
      "description": "placeholder description",
      "completionStatus": "inProgress",
      "dueDate": "2024-04-21"
    }
    showEditForm(taskID, taskData);
  }

  // Make sure to pass this function to the TaskCreator element
  function taskSaved(newTaskData) {
    //TODO: update UI to reflect newly created/edited task
    // Delete component
    setEditTaskPrompt(<></>);
  }

  function taskEditCanceled() {
    setEditTaskPrompt(<></>);
  }

  //debug function
  //GET request for all
  function logTasks() {
    //for testing purposes hardcode user "Seij"
    fetch(userDataEndpoint + "/user/" + userName, {
      method: "GET",
    }).then((response) => {
      response.json().then(a => {
        setUserTasks(a.tasks); //update all tasks
        setVisibleTasks(a.tasks); //by default display all tasks in order of oldest -> newest
      })
    }))

  }
  
  function logTasks2() {
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
      {editTaskPrompt}
      <br></br>

      <button onClick={registerUser}>
        register user (debug)
      </button>
      <button onClick={logTasks}>
      Show All Tasks
      </button>
      <button onClick={createNewTask}>
        + Create New Task
      </button>
      <button onClick={debugEditTask}>
        edit task (debug)
      </button>
      <div className = "taskList">
        {visibleTasks.map( (task, index) =>
          <Task userDataEndpoint={userDataEndpoint} task={task} key={task.id ? task.id : index}></Task>
        )}
      </div>
    </div>
  );
}

export default App;
