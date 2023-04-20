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
  const [userID, setUserID] = useState("25d18533-7fd4-4fdb-82bc-0a91dd4c1179"); //using placeholder ID for testing
  const [editTaskPrompt, setEditTaskPrompt] = useState(<></>);
  const [userTasks, setUserTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState([]); //visible tasks displayed on screen, should be pre-sorted
  
  const [sortField, setSortField] = useState("dueDate"); //field by which to sort the tasks
  const [sortAscending, setSortAscending] = useState(true);

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
        setUserTasks(a.tasks); //update all tasks
        setVisibleTasks(a.tasks); //by default display all tasks in order of oldest -> newest
      })
    });

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
          console.log("user registered");
          setUserID(jsonData["id"]);
        }
        console.log(jsonData);
      })
    })
  }

  // Compare two tasks based on a given field
  function compareTasks(taskA, taskB, taskSortField) {
    console.log(taskSortField);
    switch(taskSortField) {
      case "dueDate":
        const dateA = new Date(taskA[taskSortField]);
        const dateB = new Date(taskB[taskSortField]);
        return dateA - dateB;
      case "completionStatus":
        const statusA = taskA[taskSortField];
        const statusB = taskB[taskSortField];
        if(statusA === statusB)
          return 0;
        else if(statusA === "inProgress")
          return -1;
        return 1;
      default:
        return taskA[taskSortField].localeCompare(taskB[taskSortField]);
    }
  } 
  
  // Sort the user's tasks and update the UI accordingly
  function sortTasks(taskSortField, isAscending) {
    if(userTasks) {
      let tasksSorted = userTasks;
      tasksSorted.sort((taskA, taskB) => {
        return (isAscending ? 1 : -1)*compareTasks(taskA, taskB, taskSortField)});
      setVisibleTasks(tasksSorted);
    }  
  }

  return (
    <div className="App">
      <br></br>
      {editTaskPrompt}
      <br></br>
      <div>
        {userName}
      </div>

      <button onClick={registerUser}>
        register user (debug)
      </button>
      <button onClick={logTasks}>
      Show All Tasks
      </button>
      <button onClick={createNewTask}>
        + Create New Task
      </button>
      <div>
      Sort tasks by:
      <select value={sortField} onChange={e => 
          {
            setSortField(e.target.value);
            sortTasks(e.target.value, sortAscending);
          }
      }>
        <option value="title">Title</option>
        <option value="dueDate">Due Date</option>
        <option value="completionStatus">Completion Status</option>
        <option value="description">Description</option>
      </select>
      <button onClick={() => 
        {
          const newAscendingValue = !sortAscending;
          setSortAscending(newAscendingValue);
          sortTasks(sortField, newAscendingValue);
        }
      }>
        sort {sortAscending ? "descending" : "ascending"}
      </button>
      </div>
      
      {visibleTasks && (<div className = "taskList">
        {visibleTasks.map( (task, index) =>
          <Task userDataEndpoint={userDataEndpoint} task={task} key={task.id ? task.id : index}></Task>
        )}
      </div>)}
    </div>
  );
}

export default App;
