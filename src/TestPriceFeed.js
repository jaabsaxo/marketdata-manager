

export default function TestPriceFeed(props) {

  function TestInstrument() {
    const data = {
        "Arguments": {
          "AssetType": "FxSpot",
          "Uic": 21
        },
        "ContextId": props.ContextId,
        "ReferenceId": props.ReferenceId
    }
    const TokenDict = {
      'method': 'POST',
      'headers': { 'Authorization': 'Bearer ' + props.token,
      "Content-Type": "application/json; charset=utf-8"
    },
      'body' : JSON.stringify(data),
      'media-type': 'application/json'
    }
    let url = "https://gateway.saxobank.com/sim/openapi/trade/v1/prices/subscriptions"
    fetch(url, TokenDict).then(r => r.json()).then(r => {
      console.log(r);
      props.setDelayedByMinutes(r.Snapshot.Quote.DelayedByMinutes);
      props.setMarketState(r.Snapshot.Quote.MarketState);
      props.setPriceSource(r.Snapshot.Quote.PriceSource);
    });
  }

  return(
  <div className="test-price-feed">
    <h2>Test Price Feed</h2>
        <p>UIC:</p>
        <input type="text"></input>
        <p>AssetType:</p>
        <input type="text"></input>
        <br/>
        <br/>
        <button onClick={TestInstrument}>Test Prices</button>
        <br/>
        <br/>
        {GetPriceFeedCard(props.PriceFeed, props.LastUpdated, props.DelayedByMinutes, props.MarketState, props.PriceSource)}
        <button>Stop Stream</button>
  </div>)
}

function GetPriceFeedCard(PriceFeed, LastUpdated, DelayedByMinutes, MarketState, PriceSource) {

  return (
    <div>
      <p>Bid: <span className="from-api">{PriceFeed.Bid} </span> </p>
      <p>Ask: <span className="from-api">{PriceFeed.Ask} </span> </p>
      <p>Last Updated: <span className="from-api">{LastUpdated} </span>  </p>
      <p>DelayedByMinutes:<span className="from-api"> {DelayedByMinutes} </span> </p>
      <p>MarketState:<span className="from-api"> {MarketState} </span> </p>
      <p>PriceSource:<span className="from-api"> {PriceSource}</span> </p>
    </div>
  )

}



