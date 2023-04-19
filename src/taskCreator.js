import { useState } from "react";

/*
Notes:
* The prop onTaskCreated should be a function passed down from the parent component

*/

export default function TaskCreator({onTaskCreated, userID}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(null);
    // for <select> element
    const [usingCustomDueDate, setUsingCustomDueDate] = useState(null);

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
    function createTask() {
        //
        if((!dueDate) || isValidDate(dueDate)) {
            const newTaskData = {
                "title": title,
                "description": description,
                "completionStatus": "placeholder",
                "dueDate": dueDate,
                "userID": userID
            }

            // Send task data to parent component
            onTaskCreated(newTaskData);
        }
        console.log("Invalid due date");
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
                                    setDueDate(null);
                                    setUsingCustomDueDate(false);
                                    break;
                                case "tomorrow":
                                    let dateToday = new Date(Date.now());
                                    dateToday.setDate(dateToday.getDate()+1);
                                    setDueDate(dateToday);
                                    setUsingCustomDueDate(false);
                                    break;
                                case "custom":
                                    setDueDate(null);
                                    setUsingCustomDueDate(true);
                                    break;
                                default:
                                    setDueDate(null);
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
                <div>
                    <button onClick={createTask}>
                        Save
                    </button>
                </div>
        </div>
    )
}