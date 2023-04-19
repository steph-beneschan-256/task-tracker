import { useState } from 'react';

export default function Task({task, userDataEndpoint}) {
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
    console.log({task})
    console.log(JSON.stringify({task: data}))
    fetch(userDataEndpoint + "/task/" + task.id, {
      method: "PUT",
      body: JSON.stringify({task: data})
    }).then((response) => {
      console.log(response);
      response.json().then(a => {
        console.log(a);
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
      <img className='cursor-pointer' src="pencil.png" onClick={editClickHandler} alt="edit"></img>
      {!readOnly ? <button className='cursor-pointer' onClick={saveChangesHandler}>Save Changes</button> : null}
      {!readOnly ? <button className='cursor-pointer' onClick={cancelChangesHandler}>Cancel Changes</button> : null}
      <form onChange={changeHandler}>
        <input className={bgColorClass} readOnly={readOnly} name='title' value={data.title}></input>
        <input className={bgColorClass} readOnly={readOnly} name='description' value={data.description}></input>
        <input className={bgColorClass} readOnly={readOnly} name='dueDate' value={data.dueDate}></input>
        <input className={bgColorClass} readOnly={readOnly} name='completionStatus' value={data.completionStatus}></input>
      </form>
    </div>
  )
}
