import React from 'react';


function Output(props) {

  const output = props.data.map((poke) => {return <p>{poke[1]}</p>})
  console.log(output)

  return (
    <div>
      {output}
    </div>
  )
}

export default Output;
