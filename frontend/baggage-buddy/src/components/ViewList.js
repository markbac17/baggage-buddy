import React from 'react';
import '../App.css';

function ViewList(props) {

  let list = props.person.map((a) => {
    return <><p className="name_items">{a.Fname} {a.Lname}</p></>
    })

  return (<p>{list}</p>)
}

export default ViewList;


