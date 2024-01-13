import { useNavigate, useParams } from 'react-router-dom'
import {
  fetchMarketPrice,
  fetchTradeSummaryDetails,
} from '../../../services/api'
import { useQuery } from 'react-query'
import {
  calculateDifference,
  getAvgValue,
  getCallPut,
  getDaysOpen,
  getEntryPrice,
  getExpiryDate,
  getForexTicker,
  getStrikePrice,
} from '../../../lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { KTIcon } from '../../../_metronic/helpers'
import moment from 'moment'
import { StatisticsWidgetCustom2 } from '../../../_metronic/partials/widgets/statistics/StatisticsWidgetCustom2'

export const TradeDetailsCustom = () => {
  const { tradeId } = useParams()
  const navigate = useNavigate()

  const [underlyingPrice, setUnderlyingPrice] = useState(0)
  const [currentMarketPrice, setCurrentMarketPrice] = useState(0)

  const { data: tradeDetails } = useQuery('tradeDetails', () =>
    fetchTradeSummaryDetails(tradeId ? tradeId : '')
  )
  const tradeDetailsData = tradeDetails?.data[0]

  let tickerSymbol: string

  if (tradeDetailsData?.equityType == 'Forex') {
    const ts = getForexTicker(tradeDetailsData?.ticker)
    tickerSymbol = ts.replace('/', '')
  } else if (tradeDetailsData?.equityType == 'Option') {
    tickerSymbol = tradeDetailsData?.ticker?.split('_')[0]
  } else tickerSymbol = tradeDetailsData?.ticker

  const user: {
    username: string
    profilePic: string
  } = {
    username: tradeDetailsData?.user?.username,
    profilePic: tradeDetailsData?.user?.profilePicture,
  }

  const isOpen = tradeDetailsData?.isOpen

  const entryPrice = tradeDetailsData?.entryPrice

  const exitPrice = tradeDetailsData?.exitPrice

  const transactionType = tradeDetailsData?.transactionType
  const tradeDirection = tradeDetailsData?.tradeDirection
  const equityType = tradeDetailsData?.equityType
  const profitOrLossPercentage = tradeDetailsData?.profitOrLossPercentage

  const avgBuy =
    tradeDetailsData?.avgBuy?.reduce((i: number, c: number) => {
      return i + c
    }, 0) / tradeDetailsData?.avgBuy?.length

  const profitLosssPercent = useMemo(
    () =>
      calculateDifference(
        tradeDirection === 'BTO' ? 'STC' : 'BTC',
        currentMarketPrice,
        avgBuy
      ),
    [currentMarketPrice]
  )
  const sentiment =
    tradeDetailsData?.tradeDirection == 'BTO' ? 'Bullish' : 'Bearish'

  const trade_data = tradeDetailsData?.tradeData

  const priceTarget =
    trade_data?.length > 0 && trade_data?.find((x: any) => x?.tp)?.tp
      ? '$' + trade_data?.find((x: any) => x?.tp)?.tp
      : 'N/A'
  const stopLoss =
    trade_data?.length > 0 && trade_data?.find((x: any) => x?.sl)?.sl
      ? '$' + trade_data.find((x: any) => x?.sl)?.sl
      : 'N/A'

  useEffect(() => {
    let priceIntervalId: NodeJS.Timer

    const fetchMarketData = async () => {
      try {
        const marketData = await fetchMarketPrice(
          tradeDetailsData?.equityType,
          tickerSymbol
        )

        setCurrentMarketPrice(marketData?.data.regularMarketPrice)

        if (tradeDetailsData?.equityType === 'Option') {
          setUnderlyingPrice(
            marketData?.data.underlyingPrice
              ? marketData?.data.underlyingPrice?.toFixed(2)
              : 'N/A'
          )
        } else {
          setUnderlyingPrice(
            tradeDetailsData?.isOpen
              ? marketData?.data.regularMarketPrice
              : tradeDetailsData?.exitPrice
              ? tradeDetailsData?.exitPrice?.toFixed(2)
              : 0
          )
        }
      } catch (error) {
        console.error('Error fetching market data:', error)
      }
    }

    if (isOpen) {
      fetchMarketData()
      priceIntervalId = setInterval(fetchMarketData, 10000)
    }

    return () => clearInterval(priceIntervalId)
  }, [tradeDetails, isOpen, tickerSymbol])

  const iframeHtml = `
  <div class="tradingview-widget-container" style="padding: 0; margin: 0; background; height: 95vh;">
    <div id="tradingview_${tickerSymbol}" style="height: 100%;"></div>
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
    <div className='container-fluid oveflow-lg-hidden'>
      <div className='row flex-column-reverse flex-lg-row'>
        {tradeDetails ? (
          <div className='col-12 col-lg-8 vh-70'>
            <iframe
              title={`TradingView Chart - ${tickerSymbol}`}
              srcDoc={iframeHtml}
              width='100%'
              // height={510}
              frameBorder='0'
              style={{
                backgroundColor: 'transparent',
                marginTop: 20,
                height: '100%',
              }}
            />
          </div>
        ) : null}

        <div className='col-12 col-lg-4 vh-lg-75 overflow-y-scroll'>
          {/* Avatar */}
          <div className='d-flex align-items-center justify-content-between bg-dark p-4 rounded mb-10'>
            <div className='d-flex align-items-center gap-4'>
              <div className='symbol symbol-75px'>
                {user.profilePic ? (
                  <img src={user.profilePic} alt='' />
                ) : (
                  <div className='symbol-label fs-2 fw-semibold text-warning'>
                    {user?.username?.slice(0, 1)}
                  </div>
                )}
              </div>

              <div className='fw-bold fs-3 text-gray-200'>{user?.username}</div>
            </div>

            <div className='d-flex align-items-center gap-2'>
              {/* Share Button */}
              {/* <button
                type='button'
                className='btn btn-sm btn-icon btn-active-light-primary me-3'
                aria-label='Share trade idea'
                // onClick={() => setShowSettings(!showSettings)}
              >
                <i className='fa-solid fa-arrow-up-right-from-square text-light fs-3'></i>
              </button>
 */}
              {/* IsOpen */}

              <div className='d-flex align-items-center gap-2 '>
                {isOpen ? (
                  <i className='fa-solid fa-lock-open text-success fs-4'></i>
                ) : (
                  <i className='fa-solid fa-lock text-danger'></i>
                )}
                <span
                  className={`fs-5 fw-medium ${
                    isOpen ? 'text-success' : 'text-danger'
                  }`}
                >
                  {isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          </div>

          <div className='row'>
            {[
              { title: 'Coin', description: tickerSymbol },
              {
                title:
                  tradeDirection === 'STO'
                    ? 'SHORT'
                    : transactionType === 'Debit'
                    ? 'BOUGHT'
                    : 'SOLD',
                description: equityType,
              },
              {
                title: `Price ${
                  isOpen
                    ? profitLosssPercent.percentage > 0
                      ? 'Gain'
                      : 'Loss'
                    : profitOrLossPercentage > 0
                    ? 'Gain'
                    : 'Loss'
                }`,
                description: priceTarget,
              },
              {
                title: '% Profit',
                description: `${profitLosssPercent.percentage.toFixed(2)}%`,
              },
            ].map((trade, index) => (
              <div key={trade.title} className='col-6 col-md-3'>
                <StatisticsWidgetCustom2
                  className='card-xl-stretch mb-xl-8 text-center'
                  color='light'
                  title={trade.title}
                  titleColor={
                    index === 1
                      ? tradeDirection === 'STO'
                        ? 'gray-700'
                        : transactionType === 'Debit'
                        ? 'success'
                        : 'danger'
                      : 'gray-900'
                  }
                  description={trade.description}
                  descriptionColor={
                    index === 1
                      ? 'warning'
                      : index === 3
                      ? profitLosssPercent.percentage >= 0
                        ? 'success'
                        : 'danger'
                      : 'muted'
                  }
                />
              </div>
            ))}
          </div>

          <div className='separator mb-7 border-gray-300'></div>

          <div className='row'>
            {[
              { title: 'Trade Entry', description: `$${entryPrice}` },
              {
                title: 'Trade Exit',
                description: `$${exitPrice ? exitPrice?.toFixed(2) : 'N/A'}`,
              },
              {
                title: 'Current Price',
                description: `${
                  currentMarketPrice
                    ? tradeDetailsData?.equityType == 'Crypto'
                      ? '$' + currentMarketPrice?.toFixed(4)
                      : '$' + currentMarketPrice
                    : 'N/A'
                }`,
              },
              {
                title: 'Underlying',
                description: `$${
                  underlyingPrice
                    ? tradeDetailsData?.equityType == 'Crypto'
                      ? underlyingPrice?.toFixed(4)
                      : underlyingPrice
                    : 'N/A'
                }`,
              },
            ].map((trade) => (
              <div key={trade.title} className='col-6 col-md-3'>
                <StatisticsWidgetCustom2
                  className='card-xl-stretch mb-xl-8 text-center'
                  color='light'
                  title={trade.title}
                  titleColor='text-gray-500'
                  description={trade.description}
                  descriptionColor='muted'
                />
              </div>
            ))}
          </div>

          <div className='separator mb-7 border-gray-300'></div>

          <div className='row'>
            {[
              { title: 'Trade Type', description: transactionType },
              { title: 'Trade Direction', description: sentiment },
              { title: 'Price Target', description: priceTarget },
              { title: 'Stop Loss', description: stopLoss },
            ].map((trade, index) => (
              <div key={trade.title} className='col-6 col-md-3'>
                <StatisticsWidgetCustom2
                  className='card-xl-stretch mb-xl-8 text-center'
                  color={index >= 2 ? 'gray-300' : 'light'}
                  title={trade.title}
                  titleColor='text-gray-500'
                  description={trade.description}
                  descriptionColor='muted'
                />
              </div>
            ))}
          </div>

          <div className='separator mb-7 border-gray-300'></div>

          <div className='timeline'>
            {trade_data?.map((item: any, index: number) => {
              const dateOne = moment(item.createdAt).format('DD-MM-YYYY')
              const dateTwo = trade_data[index - 1]?.createdAt
                ? moment(trade_data[index - 1]?.createdAt).format('DD-MM-YYYY')
                : moment().format('DD-MM-YYYY')
              const priceOne = item.price
              const priceTwo = trade_data[index - 1]?.price

              return (
                <div key={item?._id} className='timeline-item'>
                  <div className='timeline-line w-40px'></div>

                  <div className='timeline-icon symbol symbol-circle symbol-20px me-4'>
                    <div className='symbol-label bg-light'>
                      <KTIcon iconName='chart' className='fs-2 text-info' />
                    </div>
                  </div>

                  <div className='timeline-content mb-10 mt-n1'>
                    <div className='pe-3 mb-5'>
                      <div className='fs-6 fw-semibold text-muted mb-2 fst-italic'>
                        {dateOne !== dateTwo
                          ? `${moment(item.createdAt).format(
                              'MMMM DD, YYYY'
                            )} | ${moment(item.createdAt).format(
                              'hh:MM:SS A'
                            )} (${moment(item.createdAt).fromNow()})`
                          : index !== 0
                          ? `${moment(item.createdAt).format(
                              'hh:MM:SS A'
                            )} (${moment(item.createdAt).fromNow()})`
                          : `${moment(item.createdAt).format(
                              'MMMM DD, YYYY'
                            )} | ${moment(item.createdAt).format(
                              'hh:MM:SS A'
                            )} (${moment(item.createdAt).fromNow()})`}
                      </div>

                      <div className='d-flex align-items-center mt-4 fs-8 gap-6'>
                        {tradeDetailsData.equityType === 'Stock' ||
                        tradeDetailsData.equityType === 'Crypto' ||
                        tradeDetailsData.equityType === 'Forex' ? (
                          <div className='d-flex align-items-center flex-wrap gap-6'>
                            <div
                              className={`btn btn-solid btn-sm w-90px py-2 fs-9 ${
                                item?.transactionType === 'Debit'
                                  ? 'bg-success'
                                  : 'bg-danger'
                              }`}
                            >
                              {item?.tradeDirection == 'STO'
                                ? 'SHORT'
                                : item.transactionType === 'Debit'
                                ? 'BOUGHT'
                                : 'SOLD'}
                            </div>
                            {tradeDetailsData?.isOpen ? (
                              <>
                                <div className='text-muted me-4 fs-9'>
                                  @{' '}
                                  <span className='ms-2 bg-gray-400 text-dark rounded py-2 px-4 fw-medium'>
                                    {`$${
                                      item?.price ? item?.price : entryPrice
                                    }`}
                                  </span>
                                </div>

                                {priceOne !== priceTwo &&
                                  priceTwo !== undefined && (
                                    <div className='text-muted me-4 fs-9'>
                                      Avg:{' '}
                                      <span className='ms-2 bg-gray-400 text-dark rounded py-2 px-4 fw-medium'>
                                        {`$${getAvgValue([
                                          priceOne,
                                          priceTwo,
                                        ])}`}
                                      </span>
                                    </div>
                                  )}
                              </>
                            ) : (
                              <div className='text-muted me-4 fs-9'>
                                @{' '}
                                <span className='ms-2 bg-gray-400 text-dark rounded py-2 px-4 fw-medium'>
                                  {`$${
                                    item?.price
                                      ? item?.price
                                      : getEntryPrice(tradeDetailsData)
                                  }`}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className='d-flex align-items-center flex-wrap gap-6'>
                            <div
                              className={`btn btn-solid btn-sm w-90px py-2 ${
                                item?.transactionType === 'Debit'
                                  ? 'bg-success'
                                  : 'bg-danger'
                              }`}
                            >
                              {item?.tradeDirection == 'STO'
                                ? 'SHORT'
                                : item.transactionType === 'Debit'
                                ? 'BOUGHT'
                                : 'SOLD'}
                            </div>

                            <div className='text-muted me-4 fs-9'>
                              <span className='ms-2 bg-gray-400 text-dark rounded py-2 px-4 fw-medium'>
                                {getExpiryDate(tradeDetailsData)}
                              </span>

                              <span className='ms-2 bg-dark text-gray-400 rounded py-2 px-4 fw-medium'>
                                {`${getDaysOpen(tradeDetailsData)}D`}
                              </span>
                            </div>

                            <div className='text-muted me-4 fs-9'>
                              <span className='ms-2 bg-gray-400 text-dark rounded py-2 px-4 fw-medium'>
                                {`$${getStrikePrice(tradeDetailsData)}`}
                              </span>

                              <span className='ms-2 bg-dark text-gray-400 rounded py-2 px-4 fw-medium'>
                                {getCallPut(tradeDetailsData)}
                              </span>
                            </div>

                            <div className='text-muted me-4 fs-9'>
                              @{' '}
                              <span className='ms-2 bg-gray-400 text-dark rounded py-2 px-4 fw-medium'>
                                {`$${
                                  item?.price
                                    ? item?.price
                                    : getEntryPrice(tradeDetailsData)
                                }`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className='w-100 px-10 px-lg-20 w-lg-50 mx-auto position-fixed start-50 bottom-0 z-index-1 translate-middle'>
        <div className='d-flex justify-content-stretch mb-2 gap-8'>
          <button className='btn btn-sm btn-warning w-100'>
            {tradeDirection === 'STO' ? 'Short More' : 'Buy More'}
          </button>
          <button
            className='btn btn-sm btn-info w-100'
            onClick={() => navigate('/wall-post')}
          >
            Post Update
          </button>
        </div>

        <button
          className='w-100 btn btn-sm btn-danger'
          onClick={() => navigate('/')}
        >
          Close Trade
        </button>
      </div>
    </div>
  )
}
