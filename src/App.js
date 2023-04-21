import logo from "./logo.svg";
import "./App.css";
import TaskCreator from "./taskCreator";
import Task from "./Task";
import LoginBar from "./LoginBar";
import { useState } from "react";
import { useEffect } from "react";
import { render } from "@testing-library/react";
import TaskList from "./TaskList";
import useLocalStorage from "./useLocalStorage";
import { database } from "./firebaseData/firebase";
import { ref, get } from "firebase/database";
let taskData = require("./sampleTaskData.json");
const userDataEndpoint = "https://lighthall-task-app.onrender.com";


function App() {
  // Name and ID of currently logged-in user
  const [userName, setUserName] = useState(""); //placeholder user name
  const [userID, setUserID] = useState(""); //using placeholder ID for testing
  const [editTaskPrompt, setEditTaskPrompt] = useState(<></>);
  const [userTasks, setUserTasks] = useState([]);
  const [userDataLS, setUserDataLS] = useLocalStorage(null, "userData")

  useEffect(() => {
    console.log(userDataLS)
  },[userDataLS]);

  function showEditForm(taskID = null, taskData = null) {
    setEditTaskPrompt(
      <TaskCreator
        onTaskSaved={taskSaved}
        onEditCanceled={taskEditCanceled}
        userID={userID}
        userName={userName}
        taskID={taskID}
        taskData={taskData}
      />
    );
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
    setUserDataLS(null)
    setUserName("");
    setUserID("");
    setUserTasks([]);
  }

  //GET request for all
  function logTasks() {
    //for testing purposes hardcode user "Seij"
    console.log("non onon");

    get(ref(database, `/user/${userName}`)).then((snapshot) => {
      if(snapshot.exists()) {
        const tasks = snapshot.val()["tasks"];
        console.log(tasks);
        console.log(Object.keys(tasks));
        const a = Object.keys(tasks).map((taskID) => {
          return tasks[taskID];
        });
        console.log(a);
        setUserTasks(a);
        //
      }
    })


    // fetch(`${userDataEndpoint}/user/${userName}`, {
    //   method: "GET",
    //   headers: {
    //     Accept: "*/*",
    //     Connection: "keep-alive",
    //   },
    // }).then((response) => {
    //   response.json().then((a) => {
    //     console.log(a);
    //     setUserTasks(a.tasks); //update all tasks for the UI
    //   });
    // });
  }

  return (
    <div className={`App ${!userID ? "loggedOut" : "loggedIn"}`}>
      {!userID ? (
        <div id="loginBarContainer">
          <LoginBar onLoggedIn={loggedIn} dataEndpoint={userDataEndpoint} setUserDataLS={setUserDataLS} userDataLS={userDataLS} />
        </div>
      ) : (
        <div className='currentUser'>
          Logged in as {userName}
          <button onClick={loggedOut}>Sign Out</button>
        </div>
      )}

      {userID && (
        <>
          {editTaskPrompt}
          <div className = 'centeredItems'>
            <button onClick={logTasks}>Show All Tasks</button>
            <button onClick={createNewTask}>+ Create New Task</button>
          </div>
          {userID ? (
            <div>
              <TaskList
                logTasks={logTasks}
                userDataEndpoint={userDataEndpoint}
                userTasks={userTasks}
                userName={userName}
              />
            </div>
          ) : (
            <div>Please log in to view and edit your tasks.</div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
