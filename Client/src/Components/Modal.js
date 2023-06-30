import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";

const url = 'http://localhost:8000/tasks'

function Modal({mode,setShowModal,getData,task}) {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const editmode = mode === "Edit" ? true : false

  const [data, setData] = useState({
    userEmail: cookies.Email,
    title: editmode? task.title : null,
    progress: editmode?task.progress : null,
    date: editmode? task.date : new Date(),
  })

  const postData=async(e)=> {
    e.preventDefault()
    try {
      const currentTask = await axios.post(`${url}`,data)
      if(currentTask.status===200){
        console.log("Task added")
        setShowModal(false)
        getData()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const editData= async(e)=>{
      e.preventDefault()
      try {
          const editTask = await axios.put(`${url}/${task.id}`,data)
          if(editTask.status===200){
            setShowModal(false)
            console.log("Task modified")
            getData()
          }
      } catch (error) {
        console.log(error)
      }
  }

  const handleChange = (e)=> {
    const {name, value} = e.target
    setData(data => ({...data, [name]:value}))
  }

    return (
      <div className="overlay">
        <div className="modal">
          <div className="form-title-container">
            <h3>{mode} your Task</h3>
            <button onClick={()=> setShowModal(false)}>X</button>
          </div>
          <form>
              <input required maxLength={30} placeholder={editmode? task.title : "Add Task"} name="title" value={data.title} onChange={handleChange}/> <br/>
              <label for="range">Drag to select current progress {editmode? task.progress :data.progress}</label>
              <input required type="range" min="0" max="100" name="progress" onChange={handleChange} value={data.progress}/> <br/>
              <input type="submit" className={mode} onClick={editmode? editData: postData}/>
          </form>
        </div>
      </div>  
    );
  }
  
  export default Modal;
  