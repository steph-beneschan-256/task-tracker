import { useState } from "react";

const userDataEndpoint = "https://lighthall-task-app.onrender.com";

/*
Notes:
* The prop onTaskCreated should be a function passed down from the parent component

* should move fetching to inside this component
* rewrite component to allow for editing as well as creating tasks; could receive taskData object as prop along with taskID
*/

export default function TaskCreator({onTaskSaved, onEditCanceled, userID, taskID, taskData}) {
    const [title, setTitle] = useState(taskData ? taskData["title"] : "");
    const [description, setDescription] = useState(taskData ? taskData["description"] : "");
    const [dueDate, setDueDate] = useState(taskData ? taskData["dueDate"] : "");
    // for <select> element
    const [usingCustomDueDate, setUsingCustomDueDate] = useState(false);

    const [statusMsg, setStatusMsg] = useState("");

    /*
    Validate the input date string from the <input type="date"> element.

    (Does the other data need similar validation methods?)
    */
    function isValidDate(dateStr){
        /*
        Note: Mozilla's HTML documentation indicates that for a date input
        element, the date entered by the user is always stored internally
        in the format yyyy-mm-dd
        https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#sect1
        */

        // See if the string can be parsed as a Date object
        const dateObj = new Date(dateStr);
        if(dateObj === "Invalid Date")
            return false;
        return true;
    }

    /*
    Once the user has submitted valid task information,
    create a new task data object.
    */
    function saveTask() {
        // Ensure that due date is null or valid
        if((!dueDate) || isValidDate(dueDate)) {
            const newTaskData = {
                "title": title,
                "description": description,
                "completionStatus": "inProgress",
                "dueDate": dueDate,
                "userId": userID
            }
            console.log(newTaskData);

            fetch(`${userDataEndpoint}/task${taskID ? `/${taskID}` : ""}`, {
                method: (taskID ? "PUT" : "POST"),
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  "task": newTaskData
                })
              }).then(response => {
                console.log(response);
                if(response["status"] === 201) {
                    // Inform the parent component that the data has been saved
                    onTaskSaved(newTaskData);
                }
                else {
                    console.log("Could not save data");
                    setStatusMsg(response["statusText"]);
                }
                //TODO: error handling
              })

        }
    }

    return (
        <div className="task-creator">
            <h3>Create new task:</h3>
            <div className="temp-black-line"></div>
            <div style={{"marginTop": "20px", "marginBottom": "20px"}}>
                <label>
                    Task name:
                    <div className="task-input-field">
                        <input value={title}
                        className="task-title-input"
                        placeholder="My Task" 
                        onChange={e => setTitle(e.target.value)} />
                    </div>
                    
                </label>
                <br/>
                
                <label>
                    Due Date:
                    <div className="task-input-field">
                        <select defaultValue={"none"} onChange={(e) => {
                            switch(e.target.value) {
                                case "none":
                                    setDueDate("");
                                    setUsingCustomDueDate(false);
                                    break;
                                case "tomorrow":
                                    let dateTomorrow = new Date(Date.now());
                                    dateTomorrow.setDate(dateTomorrow.getDate()+1);
                                    setDueDate(dateTomorrow.toDateString());
                                    setUsingCustomDueDate(false);
                                    break;
                                case "custom":
                                    setDueDate("");
                                    setUsingCustomDueDate(true);
                                    break;
                                default:
                                    setDueDate("");
                                    break;
                            }
                        }}>
                            <option value="none">
                                No due date
                            </option>
                            <option value="tomorrow">
                                Tomorrow
                            </option>
                            <option value="custom">
                                Pick a time...
                            </option>
                        </select>
                        {usingCustomDueDate && (<input type="date" className="date-input" value={dueDate}
                        onChange={e => setDueDate(e.target.value)}>
                        </input>) }
                        {
                            usingCustomDueDate && !isValidDate(dueDate) && 
                            <span className="input-warning">(!) Please enter a valid date</span>
                        }
                    </div>
                </label>
                <br/>

                <label>
                    Description:
                    <div className="task-input-field">
                        <textarea value={description}
                        placeholder="(Please describe your task here)"
                        onChange={e => setDescription(e.target.value)}/>
                    </div>
                </label>

            </div>
                <div style={{"padding":"50px"}}>
                    <button className="task-cancel-button" onClick={onEditCanceled}>
                        Cancel
                    </button>
                    <button className="task-save-button" onClick={saveTask}>
                        Save
                    </button>
                </div>
                <div>
                    {(statusMsg !== "") && statusMsg}
                </div>
        </div>
    )
}