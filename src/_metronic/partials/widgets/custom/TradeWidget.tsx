import moment from 'moment'
import _ from 'lodash'

import { getTradePrice } from '../../../../lib/utils'

export function TradeWidget({
  className,
  data,
  showTitle,
}: {
  className: string
  data: any
  showTitle?: boolean
}) {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      {showTitle ? (
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Trades</span>
          </h3>
        </div>
      ) : null}
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4 text-center'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='min-w-125px rounded-start'>Coin</th>
                <th className='min-w-125px'>Option</th>
                <th className='min-w-125px'>Price Profit/Loss</th>
                <th className='min-w-125'>% Profit/Loss</th>
                <th className='min-w-125px'>Date</th>
                <th className='min-w-125px'>Trade</th>
                <th className='min-w-125px'>$(c)</th>
                <th className='min-w-125px rounded-end'>@</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {data?.summary_data.map((summary: any) => {
                const equityType = summary.equityType
                const entryPrice = _.result(summary, 'entryPrice', 0)
                  ? equityType === 'Crypto'
                    ? _.result(summary, 'entryPrice', 0)?.toFixed(3)
                    : _.result(summary, 'entryPrice', 0)?.toFixed(2)
                  : '0'

                const profitOrLossPercentage = summary.profitOrLossPercentage
                  ? summary.profitOrLossPercentage?.toFixed(2)
                  : 0

                const profitOrLossDifference = summary.profitOrLossDifference
                  ? summary.profitOrLossDifference.toFixed(2)
                  : 0

                let tradeDirection = summary.tradeDirection

                const ticker = _.result(summary, 'ticker', '')
                const tickerName = ticker?.split('_')[0]
                const month = ticker?.substring(1, 2)
                const date = ticker?.substring(2, 4)
                const year = ticker?.substring(4, 6)

                tradeDirection =
                  tradeDirection !== '' && tradeDirection === 'BTO' ? 'C' : 'P'

                const expiryDate = `${month}/${date}/${year}`
                const expDate = moment(expiryDate, 'MM/DD/YYYY').format(
                  'MMM DD'
                )

                const given = moment(expiryDate, 'MM/DD/YYYY')
                const current = moment().startOf('day')
                const daysOpens = moment.duration(given.diff(current)).asDays()
                const openDays = Math.floor(daysOpens)

                return summary?.tradeData.map((item: any) => {
                  const transactionType = _.result(
                    item,
                    'transactionType',
                    ''
                  ) as string
                  const isOpen = _.result(item, 'isOpen', false)
                  const strikePrice = ticker?.substring(6)

                  return (
                    <tr key={item?._id}>
                      <td>
                        <div className=' fw-bold  mb-1 fs-6'>{tickerName}</div>
                      </td>
                      <td>
                        <div
                          className={`fw-bold  mb-1 fs-6 ${
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
                          className={` fw-bold  mb-1 fs-6 ${
                            profitOrLossDifference > 0
                              ? 'text-success'
                              : profitOrLossDifference < 0
                              ? 'text-danger'
                              : ''
                          }`}
                        >
                          {`$${getTradePrice(
                            equityType,
                            profitOrLossDifference
                          )}`}
                        </div>
                      </td>
                      <td>
                        <div className={`fw-bold  mb-1 fs-6 `}>
                          {profitOrLossPercentage}
                        </div>
                      </td>
                      <td>
                        {openDays ? (
                          <div className={` fw-bold  mb-1 fs-6 `}>
                            {expDate} {`(${openDays}D)`}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <div className={` fw-bold  mb-1 fs-6 `}>
                          {isOpen ? 'Open' : 'Closed'}
                        </div>
                      </td>
                      <td>
                        {strikePrice ? (
                          <div className='text-gray-900 fw-bold  mb-1 fs-6'>
                            {`$${strikePrice}`} ({tradeDirection})
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold  mb-1 fs-6'>
                          {`$${entryPrice}`}
                        </div>
                      </td>
                    </tr>
                  )
                })
              })}
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
