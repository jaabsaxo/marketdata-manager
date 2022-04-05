import './App.css';
import TestSessionCapabilities from './TestSessionCapabilities';
import TestPriceFeed from './TestPriceFeed';
import React, {useEffect, useState} from "react";
import parseMessageFrame from "../utils";


function NotLoggedIn() {

  function LoginSim() {
    const client_id = "e2707839cf064a97b3d335dc77728352";
    const stateString = "State" + Math.random().toString();
    const redirectUrl = "https://jaabsaxo.github.io/marketdata-manager/authorized";
    const url = "https://sim.logonvalidation.net/authorize?response_type=token&client_id="+client_id+"&state="+stateString+"&redirect_uri="+redirectUrl;

    const options = {
      method: 'GET',
      mode: 'no-cors',
      redirect: 'follow'
    };
    console.log("log in..");
    window.open(url, '_self');
    }

  return (
    <div className="App">
      <div className="padded">
        <h1> <span className="blue-header"> Market Data </span> Manager </h1>
        <button onClick={LoginSim}>Login SIM</button><button onClick={LoginSim}>Login LIVE</button>
      </div> 
    </div>
  );
}






export default NotLoggedIn;