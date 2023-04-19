export default function Task({task}) {
  //this component is for a single task element

  //user can sel

  return (
    <div className='task'>
      <img src="pencil.png" alt="edit"></img>
      <h3 className='text-center'>{task.title}</h3>
      <p>{task.description}</p>
      <p>{`Due Date: ${task.dueDate}`}</p>
      <p>{task.completionStatus}</p>
    </div>
  )
}
