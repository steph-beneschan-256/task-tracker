import logo from './logo.svg';
import './App.css';
import TaskCreator from './taskCreator';

function SaveNewTask(newTaskData) {
  console.log(newTaskData);
  console.log("a");
}

function App() {
  return (
    <div className="App">
      <TaskCreator onTaskCreated={SaveNewTask}/>
    </div>
  );
}

export default App;
