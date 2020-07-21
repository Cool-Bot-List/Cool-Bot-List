import React, { Component, useState } from 'react';
import './App.css';
import Home from './components/Home';
import getAllBots from "./methods/getAllBots";
import { Alert, Button } from 'react-bootstrap';



function App () {

  const [bots, setBots] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState(false);
  
  const getBots = async () => {
    console.log('a')
    setError(false);
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await getAllBots();
        setBots(response.data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }, 1500);
  }

  return (
    <div>

      {error ? <Alert variant="danger">
        Something Went Wrong...
      </Alert> : null}

      {!loading && bots ? (
        <div>
          {/* {console.log(bots)} */window.onload = ((async () => await getBots())())}
          {bots.map(bot => <Home id={bot.id} name={bot.name} owners={bot.owners} language={bot.library}/>)}
        </div>
      ) : null}
      {/* <Button onClick={async e => await getBots()}>Nice</Button> */}

      {/* <h1 className="Testing">Hello World!</h1> */}
    </div>
  );
  
}

export default App;