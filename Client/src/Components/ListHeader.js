import React, { useState } from 'react';
import Modal from './Modal'
import { useCookies } from 'react-cookie'

function ListHeader({listName, getData}) {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [showModal, setShowModal] = useState(false)

  const signout = ()=>{
    console.log('signout')
    removeCookie('Email')
    removeCookie('AuthToken')
    window.location.reload()

  }
    return (
      <div className="list-header">
        <h1>{listName}</h1>
        <div className='button-container'>
            <button className='create' onClick={() =>setShowModal(true)}>Add new</button>
            <button className='signout' onClick={signout}>Sign out</button>
        </div>
        {showModal && <Modal mode={"Create"} setShowModal={setShowModal} getData={getData}/>}
      </div>
    );
  }
  
  export default ListHeader;
  