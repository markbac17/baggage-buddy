import React, {useState} from 'react';
import ViewList from './ViewList';
import ViewData from './ViewData'
import '../App.css';

function Home() {

    const [inputFname, setInputFname] = useState("");
    const [inputLname, setInputLname] = useState("");
    const [person, setPerson] = useState([])
  
    const addPerson = () => {
      const newPerson = {Fname: inputFname, Lname: inputLname,};
      const oldPersons = [...person];
      oldPersons.unshift(newPerson);
      setPerson(oldPersons)
    }


    const reset = () => {
      setPerson([])
    }
return (
  <>  
    <div className="item-c">
    <h1>Welcome to Baggage Buddy</h1>
      <input type="text" onChange={e => setInputFname(e.target.value)} placeholder="First Name" />
      <input type="text" onChange={e => setInputLname(e.target.value)} placeholder="Last Name" />
      <button onClick={e => addPerson()}>Add</button>
      <button onClick={e => reset()}>Reset</button>
    </div>
    <div className="item-d">
      <ViewList person={person}/>
    </div>
  </>
)
}

export default Home;