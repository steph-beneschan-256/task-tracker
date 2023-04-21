import { useState } from "react"
import Task from "./Task";

export default function TaskList({userDataEndpoint, userTasks, logTasks}) {

    const sortFieldPriority = ["completionStatus", "dueDate", "title", "description"]; // Task field priorities for tie breaking
    const [sortField, setSortField] = useState(sortFieldPriority[0]); //field by which to sort the tasks
    const [sortAscending, setSortAscending] = useState(true);

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
            return valueA - valueB;
        default:
            return taskA[taskSortField].localeCompare(taskB[taskSortField]);
        }
    }

    // Sort the user's tasks and update the UI accordingly
    function sortTasks(tasks, taskSortField, isAscending) {
        if(tasks) {
          let tasksSorted = tasks;
          tasksSorted.sort((taskA, taskB) => {
            let d = compareTasks(taskA, taskB, taskSortField);
            // Break ties, if necessary
            for(let i = 0; ((d === 0) && (i < sortFieldPriority.length)); ++i) {
              d = compareTasks(taskA, taskB, sortFieldPriority[i]);
            }
            return (isAscending ? 1 : -1)*d;
          });
          console.log("sorted the tasks");
          console.log(tasksSorted);
          return tasksSorted;
        }
        return [];
    }

    return(
        <div>
            <div className='centeredItems'>
                Sort tasks by:
                <select value={sortField} onChange={e => setSortField(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="dueDate">Due Date</option>
                    <option value="completionStatus">Completion Status</option>
                    <option value="description">Description</option>
                </select>
                <button onClick={() => setSortAscending(!sortAscending)}>
                    sort {sortAscending ? "descending" : "ascending"}
                </button>
            </div>

            {(userTasks && (userTasks.length > 0)) ? (
                <div className = "taskList">
                    {sortTasks(userTasks, sortField, sortAscending).map( (task, index) =>
                    <Task logTasks={logTasks} userDataEndpoint={userDataEndpoint} task={task} key={task.id ? task.id : index}></Task>
                )}
                </div>
            ) : (
                <div>
                    You have no tasks. Please click the "Create New Task" button to add a new task.
                </div>
            )}
        </div>
    )
}
