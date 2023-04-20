import { useState } from 'react';

export default function Task({task, userDataEndpoint, logTasks}) {
  //this component is for a single task element

  //clicking the pencil icon will:
  //1: change styling behind text to white
  //2: allow user to modify text with white background
  //3:display a 'save changes' button that will submit task data to PUT

  const defaultTask = {
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    completionStatus: task.completionStatus
  };

  const [data, setData] = useState(defaultTask)
  const [bgColorClass, setBgColorClass] = useState('transparent');
  const [readOnly, setReadOnly] = useState(true);

  const changeHandler = e => {
    setData( prevData => {
      return {...prevData, [e.target.name]: e.target.value}
    })
  }

  const saveChangesHandler = () => {
    //submit a PUT request with current form values
    fetch(userDataEndpoint + "/task/" + task.id, {
      method: "PUT",
      body: JSON.stringify({task: data}),
      headers: {
        'Accept': 'application/json;charset=utf-8',
        'Content-Type': 'application/json;charset=utf-8'
    }
    }).then((response) => {
      console.log(response);
      if (response.status === 404) {
        console.log('error in PUT request, 404 error')
        cancelChangesHandler();
      }
      response.json().then(a => {
        setReadOnly(true);
        setBgColorClass('transparent');
        logTasks();
      })
      .catch((err) => {
        console.log('error in PUT request')
        console.log(err);
        cancelChangesHandler();
      })
    })
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
  return (
    <div className='task'>
      <form onChange={changeHandler}>
        <textarea   className={bgColorClass} readOnly={readOnly} name='title' value={data.title}></textarea>
        <textarea  className={bgColorClass+' description'} readOnly={readOnly} name='description' value={data.description}></textarea>
        <textarea  className={bgColorClass} readOnly={readOnly} name='dueDate' value={data.dueDate}></textarea>
        <textarea  className={bgColorClass} readOnly={readOnly} name='completionStatus' value={data.completionStatus}></textarea>
      </form>
      <div className="flex">
        <img className='cursor-pointer' src="pencil.png" onClick={editClickHandler} alt="edit"></img>
        {!readOnly ? <button className='cursor-pointer' onClick={saveChangesHandler}>Save Changes</button> : null}
        {!readOnly ? <button className='cursor-pointer' onClick={cancelChangesHandler}>Cancel Changes</button> : null}
      </div>
    </div>
  )
}
