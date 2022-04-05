

export default function TestSessionCapabilities(props) {

  function getNewTradeLevel() {
    if (props.sessionCapabilities=="FullTradingAndChat") {
      return "OrdersOnly";
    } else {
      return "FullTradingAndChat";
    }
  }

  function Change() {
    let newCapabilities = getNewTradeLevel(); 
    const data = {
        "TradeLevel": newCapabilities,
    }
    const TokenDict = {
      'method': 'PUT',
      'headers': { 'Authorization': 'Bearer ' + props.token,
      "Content-Type": "application/json; charset=utf-8"
    },
      'body' : JSON.stringify(data),
      'media-type': 'application/json'
    }
    let url = "https://gateway.saxobank.com/sim/openapi/root/v1/sessions/capabilities"
    fetch(url, TokenDict);
  }

  return (
    <div className="test-session-capabilities">
      <h2>Test Session Capabilites</h2>
        <br/>
        <p>Session capabilities: <span className="from-api">{props.sessionCapabilities}</span></p>
        <br/>
        <button onClick={Change}>Switch to <span>{getNewTradeLevel()}</span></button>
    </div>
  );
}

