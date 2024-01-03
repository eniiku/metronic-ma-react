import _ from 'lodash'
import moment from 'moment'
import { getTradePrice } from '../../../../lib/utils'

export function TradeWidgetCustom2({ className, data }: any) {
  const equityType = data?.equityType
  const entryPrice = _.result(data, 'entryPrice', 0)
    ? equityType === 'Crypto'
      ? _.result(data, 'entryPrice', 0)?.toFixed(3)
      : _.result(data, 'entryPrice', 0)?.toFixed(2)
    : '0'

  const profitOrLossPercentage = data?.profitOrLossPercentage
    ? data?.profitOrLossPercentage?.toFixed(2)
    : 0

  const profitOrLossDifference = data?.profitOrLossDifference
    ? data?.profitOrLossDifference.toFixed(2)
    : 0

  let tradeDirection = data?.tradeDirection

  const ticker = _.result(data, 'ticker', '')
  const tickerName = ticker?.split('_')[0]
  const month = ticker?.substring(1, 2)
  const date = ticker?.substring(2, 4)
  const year = ticker?.substring(4, 6)

  tradeDirection = tradeDirection !== '' && tradeDirection === 'BTO' ? 'C' : 'P'

  const expiryDate = `${month}/${date}/${year}`
  const expDate = moment(expiryDate, 'MM/DD/YYYY').format('MMM DD')

  const given = moment(expiryDate, 'MM/DD/YYYY')
  const current = moment().startOf('day')
  const daysOpens = moment.duration(given.diff(current)).asDays()
  const openDays = Math.floor(daysOpens)

  const transactionType = _.result(data, 'transactionType', '') as string
  const isOpen = _.result(data, 'isOpen', false)
  const strikePrice = ticker?.substring(6)

  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className='card-body p-0'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4 text-center'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='min-w-60px rounded-start'>Coin</th>
                <th className='min-w-60px'>Option</th>
                <th className='min-w-60px'>Price Profit/Loss</th>
                <th className='min-w-60px'>% Profit/Loss</th>
                <th className='min-w-60px'>Date</th>
                <th className='min-w-60px'>Trade</th>
                <th className='min-w-60px'>$(c)</th>
                <th className='min-w-60px rounded-end'>@</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>
                  <div className=' fw-bold  mb-1 fs-9'>{tickerName}</div>
                </td>
                <td>
                  <div
                    className={`fw-bold  mb-1 fs-9 ${
                      transactionType === 'Debit'
                        ? 'text-success'
                        : 'text-danger'
                    }`}
                  >
                    {transactionType === 'Debit' ? 'BOUGHT' : 'SOLD'}
                  </div>
                </td>
                <td>
                  <div
                    className={` fw-bold  mb-1 fs-9 ${
                      profitOrLossDifference > 0
                        ? 'text-success'
                        : profitOrLossDifference < 0
                        ? 'text-danger'
                        : ''
                    }`}
                  >
                    {`$${getTradePrice(equityType, profitOrLossDifference)}`}
                  </div>
                </td>
                <td>
                  <div className={`fw-bold  mb-1 fs-9 `}>
                    {profitOrLossPercentage}
                  </div>
                </td>
                <td>
                  {openDays ? (
                    <div className={` fw-bold  mb-1 fs-9 `}>
                      {expDate} {`(${openDays}D)`}
                    </div>
                  ) : null}
                </td>
                <td>
                  <div className={` fw-bold  mb-1 fs-9 `}>
                    {isOpen ? 'Open' : 'Closed'}
                  </div>
                </td>
                <td>
                  {strikePrice ? (
                    <div className='text-gray-900 fw-bold  mb-1 fs-9'>
                      {`$${strikePrice}`} ({tradeDirection})
                    </div>
                  ) : null}
                </td>
                <td>
                  <div className='text-gray-900 fw-bold  mb-1 fs-9'>
                    {`$${entryPrice}`}
                  </div>
                </td>
              </tr>
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
