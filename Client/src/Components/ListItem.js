import React, {useState} from "react";
import ProgressBar from './ProgressBar'
import TickIcon from './TickIcon'
import Modal from "./Modal";
import axios from "axios";

const url = 'http://localhost:8000/tasks'

function ListItem({task, getData}) {
  const [showModal, setShowModal] = useState(false)

  const deleteItem= async()=>{
    try {
      const deletedTask = await axios.delete(`${url}/delete/${task.id}`)
      if(deletedTask.status===200){
        getData()
      }
    } catch (error) {
      console.log(error)
    }
  }

    return (
      <li className="list-item">
        <div className="info-container">
          <TickIcon/>
        <p className="task-title">{task.title}</p>
        <ProgressBar progress={task.progress}/>
        </div>
        <div className="button-container">
            <button className="edit" onClick={()=>setShowModal(true)}>Edit</button>
            <button className="delete" onClick={deleteItem}>Delete</button>
        </div>
        {showModal && <Modal mode={"Edit"} setShowModal={setShowModal} getData={getData} task={task}/>}
      </li>
    );
  }
  
  export default ListItem;
  