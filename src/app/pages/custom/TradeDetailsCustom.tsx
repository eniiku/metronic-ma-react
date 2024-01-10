import { useParams } from 'react-router-dom'
import { fetchTradeSummaryDetails } from '../../../services/api'
import { useQuery } from 'react-query'
import { getForexTicker } from '../../../lib/utils'

export const TradeDetailsCustom = () => {
  // const { tradeId } = useParams()

  const tradeId = '657330f3428e3eb6f362cb01'

  const { data: tradeDetails } = useQuery('tradeDetails', () =>
    fetchTradeSummaryDetails(tradeId ? tradeId : '')
  )

  const tradeDetailsData = tradeDetails?.data[0]

  console.log('Trade Details', tradeDetails)

  let tickerSymbol

  if (tradeDetailsData?.equityType == 'Forex') {
    const ts = getForexTicker(tradeDetailsData?.ticker)
    tickerSymbol = ts.replace('/', '')
  } else if (tradeDetailsData?.equityType == 'Option') {
    tickerSymbol = tradeDetailsData?.ticker?.split('_')[0]
  } else tickerSymbol = tradeDetailsData?.ticker

  const iframeHtml = `
  <div class="tradingview-widget-container" style="padding: 0; margin: 0; background">
    <div id="tradingview_${tickerSymbol}"></div>
    <div class="tradingview-widget-copyright">
      <a href="https://www.tradingview.com/symbols/${tickerSymbol}/"></a>
    </div>
    <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
    <script type="text/javascript">
      new TradingView.widget({
        "autosize": true,
        "symbol": "${tickerSymbol}",
        "interval": "15",
        "timezone": "America/New_York",
        "theme": "dark",
        "isTransparent": false,
        "locale": "en",
        "toolbar_bg": "#aa0000",
        "withdateranges": false,
        "enable_publishing": false,
        "allow_symbol_change": false,
        "container_id": "tradingview_${tickerSymbol}"
      });
    </script>
  </div>
`

  return (
    <div>
      {tradeDetails ? (
        <div>
          <iframe
            title={`TradingView Chart - ${tickerSymbol}`}
            srcDoc={iframeHtml}
            width='100%'
            height='500px'
            frameBorder='0'
            sandbox='allow-scripts allow-same-origin'
            style={{ backgroundColor: 'transparent', marginTop: 12 }}
          />
        </div>
      ) : null}
    </div>
  )
}
