import logo from './logo.svg';
import './App.css';
import TaskCreator from './taskCreator';
import Task from './Task';
import LoginBar from './LoginBar';
import { useState } from 'react';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
let taskData = require("./sampleTaskData.json");
const userDataEndpoint = "https://lighthall-task-app.onrender.com";

function App() {
  // Name and ID of currently logged-in user
  const [userName, setUserName] = useState(""); //placeholder user name
  const [userID, setUserID] = useState(""); //using placeholder ID for testing
  const [editTaskPrompt, setEditTaskPrompt] = useState(<></>);
  const [userTasks, setUserTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState([]); //visible tasks displayed on screen, should be pre-sorted
  
    
  const sortFieldPriority = ["completionStatus", "dueDate", "title", "description"]; // Task field priorities for tie breaking
  const [sortField, setSortField] = useState(sortFieldPriority[0]); //field by which to sort the tasks
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

  function loggedIn(data) {
    setUserID(data["id"]);
    setUserName(data["name"]);
    setUserTasks(data["tasks"]);
    setVisibleTasks(data["tasks"]);
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
        setUserTasks(a.tasks); //update all tasks
        setVisibleTasks(a.tasks); //by default display all tasks in order of oldest -> newest
      })
    });

  }

  // Compare two tasks based on a given field
  function compareTasks(taskA, taskB, taskSortField) {
    let valueA = taskA[taskSortField];
    let valueB = taskB[taskSortField];
    switch(taskSortField) {
      case "dueDate":
        // Sort by due date; tasks without a due date come later
        if(valueA === valueB)
          return 0;
        else if(valueA === "")
          return 1;
        else if(valueB === "")
          return -1;
        return new Date(valueA) - new Date(valueB);
      case "completionStatus":
        // Sort by completion status; completed tasks come later
        if(valueA === valueB)
          return 0;
        else if(valueA === "inProgress")
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
        let d = compareTasks(taskA, taskB, taskSortField);
        // Break ties, if necessary
        for(let i = 0; ((d === 0) && (i < sortFieldPriority.length)); ++i) {
          d = compareTasks(taskA, taskB, sortFieldPriority[i]);
        }
        return (isAscending ? 1 : -1)*d;
      });
      setVisibleTasks(tasksSorted);
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
