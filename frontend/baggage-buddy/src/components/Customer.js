import React, { useState } from 'react';

function Customer () {
  const [route, setRoute] = useState("http://baggage-buddy.duckdns.org:9014/insert_customers")
  const [f_name, setF_name] = useState("")
  const [l_name, setL_name] = useState("")
  const [status, setStatus] = useState("")

  const Customer = async () => {
    const output = document.getElementById("createAccount");
    const configs = {
      method : "POST",
      mode : "cors",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({
        f_name : f_name,
        l_name : l_name,
        delivery_conf_status : status
      })
    }
    try {
      console.log(configs, route)
      const response = await fetch(route, configs);
      const createAccount = await response.json();
      output.innerHTML = "<p>"+createAccount["response"]+"</p>";
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Customer">
      <h2>Customer</h2>
      <h4>Add Customer</h4>
      <div id="createAccount"/>
      <form>
        <input id="f_name" placeholder="First" onChange={e => setF_name(e.target.value)} ></input>
        <input id="l_name" placeholder="Last" onChange={e => setL_name(e.target.value)} ></input>
        <input id="status" placeholder="Status" onChange={e => setStatus(e.target.value)} ></input>
      </form>
      <button onClick={() => Customer()} id="createButton">Add</button>
    </div>
  )
}

export default Customer;