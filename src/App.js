import './App.css';
import TestSessionCapabilities from './TestSessionCapabilities';
import TestPriceFeed from './TestPriceFeed';
import React, {useEffect, useState} from "react";
import parseMessageFrame from "./utils";


let token = 'eyJhbGciOiJFUzI1NiIsIng1dCI6IkRFNDc0QUQ1Q0NGRUFFRTlDRThCRDQ3ODlFRTZDOTEyRjVCM0UzOTQifQ.eyJvYWEiOiI3Nzc3NSIsImlzcyI6Im9hIiwiYWlkIjoiMTA5IiwidWlkIjoiLWgtSERJWmxDSzZUZno3VXlPcEVNQT09IiwiY2lkIjoiLWgtSERJWmxDSzZUZno3VXlPcEVNQT09IiwiaXNhIjoiRmFsc2UiLCJ0aWQiOiIyMDAyIiwic2lkIjoiZTg1MTk5NDRhNDg2NGVlMTg1MDEyNmE3NjdhYWVlZmQiLCJkZ2kiOiI4NCIsImV4cCI6IjE2NDkyNDg1NzQiLCJvYWwiOiIxRiIsImlpZCI6ImFhOWM0Zjg0MGJiZDRhZTA0NDBhMDhkOWFiM2I5ZDFlIn0.EA4Dd3LWC1Mf_qu6UoZ6a31uZ27YRP9oPpZmKMANFNK3QNZms7cShnOP9qtB2z8iM4pAlUDUqK5qCdZnY8W5pw';
let contextId = 1232131;
let refferenceId = "referenceId1234"

function App() {

  function Login() {
    const data = {
        "ContextId": contextId,
        "ReferenceId": refferenceId,
        "RefreshRate": 1000,
    }
    const TokenDict = {
      'method': 'POST',
      'headers': { 'Authorization': 'Bearer ' + token,
      "Content-Type": "application/json; charset=utf-8"
    },
      'body' : JSON.stringify(data),
      'media-type': 'application/json'
    }
    let urlSessionCapabilities = "https://gateway.saxobank.com/sim/openapi/root/v1/sessions/events/subscriptions"
    fetch(urlSessionCapabilities, TokenDict).then(r => r.json()).then(r => {
      setSessionCapability(r.Snapshot.TradeLevel)
    })
  }

  const [SessionCapability, setSessionCapability] = useState("Not defined");
  const [PriceFeed, setPriceFeed] = useState({});
  const [LastUpdated, setLastUpdated] = useState("");
  const [DelayedByMinutes, setDelayedByMinutes] = useState("");
  const [MarketState, setMarketState] = useState("");
  const [PriceSource, setPriceSource] = useState("");


 useEffect(() => {
  let streamBaseUrl = 'wss://streaming.saxobank.com/sim/openapi/streamingws/connect?';
  const streamerUrl = streamBaseUrl + "authorization=" + encodeURIComponent("BEARER " + token) + "&contextId=" + contextId;
  var connection = new WebSocket(streamerUrl);
  connection.binaryType = "arraybuffer";
  console.log("Connection created with binaryType '" + connection.binaryType + "'. ReadyState: " + connection.readyState + ".");

  connection.onmessage = function (messageFrame) {
    const messages = parseMessageFrame(messageFrame.data);
    
    messages.forEach(function (message) {
        switch (message.referenceId) {
        case refferenceId:
            if (message.payload.TradeLevel) {
              let newCapabilities = message.payload.TradeLevel;
              setSessionCapability(newCapabilities);
            }
            if (message.payload.Quote) {
              setPriceFeed(message.payload.Quote)
            }
            if (message.payload.LastUpdated) {
              setLastUpdated(message.payload.LastUpdated)
            }
            if (message.payload.DelayedByMinutes) {
              setDelayedByMinutes(message.payload.DelayedByMinutes)
            }
            if (message.payload.MarketState) {
              setMarketState(message.payload.MarketState)
            }
            if (message.payload.PriceSource) {
              setPriceSource(message.payload.PriceSource)
            }
            break;
        default:
            console.error("No processing implemented for message with reference " + message.referenceId);
      }
    });
  }

 }, []);

  return (
    <div className="App">
      <div className="padded">
        <h1> <span className="blue-header"> Market Data </span> Manager </h1>
        <button onClick={Login}>Login SIM</button><button onClick={Login}>Login LIVE</button>
        <hr/>
        <TestSessionCapabilities sessionCapabilities={SessionCapability} token={token}/>
        <hr/>
        <TestPriceFeed setPriceSource={setPriceSource} setMarketState={setMarketState} setDelayedByMinutes={setDelayedByMinutes} DelayedByMinutes={DelayedByMinutes} MarketState={MarketState} PriceSource={PriceSource} LastUpdated={LastUpdated} PriceFeed={PriceFeed} ReferenceId={refferenceId} ContextId={contextId} token={token}/>
      </div> 
    </div>
  );
}






export default App;
