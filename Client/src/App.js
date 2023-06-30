import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ListHeader from './Components/ListHeader';
import ListItem from './Components/ListItem'
import Auth from './Components/Auth';
import { useCookies } from "react-cookie";

const url = 'http://localhost:8000/tasks'

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [tasks, setTasks] = useState([])
  const authToken= cookies.AuthToken
  const userEmail= cookies.Email

  const getData= async () => {
    try {
      const allTasks = await axios.get(`${url}/${userEmail}`)
      setTasks(allTasks.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(authToken) {
      getData()
    }},[])
    
  const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="app">
      {!authToken && <Auth/>}
      {authToken && <div>
      <ListHeader listName={'Project List'} getData={getData}/>
      <p className="user-email">Welcome back {userEmail}</p>
      {sortedTasks.map(task => <ListItem key={task.id} task={task} getData={getData}/>)}
      </div>}   
    </div>
  );
}

export default App;
