import { useState } from "react";

/*
Notes:
* The prop onTaskCreated should be a function passed down from the parent component

*/

export default function TaskCreator({onTaskCreated}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(new Date(Date.now()).toDateString());


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
        if(isValidDate(dueDate)) {
            const newTaskData = {
                "title": title,
                "description": description,
                "status": "placeholder",
                "due-date": dueDate,
                "userID": "placeholder"
            }

            // Send task data to paarent component
            onTaskCreated(newTaskData);
        }
    }

    return (
        <div>
            <div>
                <label>
                    Task name:
                    <input value={title}
                    placeholder="My Task" 
                    onChange={e => setTitle(e.target.value)} />
                </label>
            </div>
            <div>
            <label>
                Description:
                <input value={description}
                placeholder="(Please describe your task here)"
                onChange={e => setDescription(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                    Due Date:
                    <input type="date" value={dueDate}
                    onChange={e => setDueDate(e.target.value)}>
                    </input> 
                    {
                        !isValidDate(dueDate) && 
                        <span>Please enter a valid date</span>
                    }
                </label>
            </div>
            <div>
                <button onClick={createTask}>
                    Create New Task
                </button>
            </div>
        </div>
    )
}