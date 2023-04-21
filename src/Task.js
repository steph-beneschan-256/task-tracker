import { useState } from 'react';
import { database } from "./firebaseData/firebase";
import { ref, get, update } from "firebase/database";

const completionStatusMsgs = ["To-Do", "In-Progress", "Completed"];

export default function Task({task, userName, userDataEndpoint, logTasks}) {
  //this component is for a single task element

  const defaultTask = {
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    taskID: task.taskID
  };

  const [data, setData] = useState(defaultTask)
  const [bgColorClass, setBgColorClass] = useState('transparent');
  const [readOnly, setReadOnly] = useState(true);
  const [isComplete, setIsComplete] = useState(task.completionStatus);

  const changeHandler = e => {
    setData( prevData => {
      return {...prevData, [e.target.name]: e.target.value}
    })
  }

  const saveChangesHandler = (completed = isComplete) => {
    //submit a PUT request with current form values
    console.log({data});
    var bodyData = {...data, completionStatus: completed};
    console.log(bodyData);

    const updates = {};
    console.log(task);
    updates[task["taskID"]] = bodyData;
    console.log(task["taskID"]);
    update(ref(database, `user/${userName}/tasks`), updates).then(() => {
      setReadOnly(true);
      setBgColorClass('transparent');
      logTasks();
    });

    

    // fetch(userDataEndpoint + "/task/" + task.id, {
    //   method: "PUT",
    //   body: JSON.stringify(bodyData),
    //   headers: {
    //     'Accept': 'application/json;charset=utf-8',
    //     'Content-Type': 'application/json;charset=utf-8'
    // }
    // }).then((response) => {
    //   console.log(response);
    //   if (response.status === 404) {
    //     console.log('error in PUT request, 404 error')
    //     cancelChangesHandler();
    //   }
    //   response.json().then(a => {
    //     setReadOnly(true);
    //     setBgColorClass('transparent');
    //     logTasks();
    //   })
    //   .catch((err) => {
    //     console.log('error in PUT request')
    //     console.log(err);
    //     cancelChangesHandler();
    //   })
    // })
  }

  const cancelChangesHandler = () => {
    //reset form elements to defaults
    setData(defaultTask);
    setReadOnly(true);
    setBgColorClass('transparent');
  }

  const editClickHandler = () => {
    setReadOnly(!readOnly);
    setBgColorClass(bgColorClass === 'transparent' ? 'white' : 'transparent');
  }

  const completedClickHandler = (e) => {
    console.log(e.target.value);
    console.log(typeof(e.target.value));
    const b = parseInt(e.target.value);
    console.log(b);
    console.log(typeof(b));
    setIsComplete(b);
    saveChangesHandler(b);
  }

  return (
    <div className={`task ${isComplete}`}>
      <form onChange={changeHandler}>
        <textarea   className={bgColorClass} readOnly={readOnly} name='title' value={data.title}></textarea>
        <textarea  className={bgColorClass+' description'} readOnly={readOnly} name='description' value={data.description}></textarea>
        <label>Due By:</label><textarea  className={bgColorClass} readOnly={readOnly} name='dueDate' value={data.dueDate}></textarea>
      </form>
      <label className='flex'>
        <p>Completion Status:</p>
        <select value={isComplete} onChange={e => completedClickHandler(e)}>
          {completionStatusMsgs.map((msg, index) => {
            return(<option value={index}>{msg}</option>)
          })}
        </select>
      </label>
      <div className="flex">
        <img className='cursor-pointer' src="pencil.png" onClick={editClickHandler} alt="edit"></img>
        {!readOnly ? <button className='cursor-pointer saveChangeButton' onClick={e => saveChangesHandler()}>Save Changes</button> : null}
        {!readOnly ? <button className='cursor-pointer cancelChangeButton' onClick={cancelChangesHandler}>Cancel Changes</button> : null}
      </div>
    </div>
  )
}
