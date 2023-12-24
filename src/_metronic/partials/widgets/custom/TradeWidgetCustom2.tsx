import _ from 'lodash'
import moment from 'moment'
import { toAbsoluteUrl } from '../../../helpers'
import { getForexTicker } from '../../../../lib/utils'
import { getTradePrice } from '../../../../lib/utils'

export function TradeWidgetCustom2({ className, data }: any) {
  const equityType = data?.equityType
  const entryPrice = _.result(data, 'entryPrice', 0)
    ? equityType === 'Crypto'
      ? _.result(data, 'entryPrice', 0)?.toFixed(3)
      : _.result(data, 'entryPrice', 0)?.toFixed(2)
    : '0'

  const profitOrLossPercentage = data?.profitOrLossPercentage
    ? data.profitOrLossPercentage?.toFixed(1)
    : 0

  const profitOrLossDifference = data?.profitOrLossDifference
    ? data.profitOrLossDifference.toFixed(1)
    : 0

  let tradeDirection = data?.tradeDirection
  tradeDirection = tradeDirection !== '' && tradeDirection === 'BTO' ? 'C' : 'P'

  const ticker = _.result(data, 'ticker', '')
  const sentiment = tradeDirection === 'BTO' ? 'BULLISH' : 'BEARISH'
  const transactionType = _.result(data, 'transactionType', '') as string

  const tickerName = ticker?.split('_')[0]
  const month = ticker?.substring(1, 2)
  const date = ticker?.substring(2, 4)
  const year = ticker?.substring(4, 6)

  const strikePrice = ticker?.substring(6)
  const expiryDate = `${month}/${date}/${year}`
  const expDate = moment(expiryDate, 'MM/DD/YYYY').format('MMM DD')

  const given = moment(expiryDate, 'MM/DD/YYYY')
  const current = moment().startOf('day')
  const daysOpens = moment.duration(given.diff(current)).asDays()
  const openDays = Math.floor(daysOpens)
  return (
    <div className={`card card-flush ${className} bg-muted h-lg-100px`}>
      <div className='p-2 pb-0 d-flex align-items-center justify-content-between'>
        <div className='d-flex align-items-center gap-3'>
          <div className='text-white-gray-600 fw-bolder fs-2'>
            {equityType === 'Forex' ? getForexTicker(tickerName) : tickerName}
          </div>
          <img
            alt='Trade Icon'
            src={
              sentiment === 'BULLISH'
                ? toAbsoluteUrl('media/custom/bull.png')
                : toAbsoluteUrl('media/custom/bear.png')
            }
            className='h-20px h-lg-30px'
          />
        </div>

        <div className='fw-bold'>
          <div
            className={
              transactionType === 'Debit' ? 'text-success' : 'text-danger'
            }
          >
            {transactionType === 'Debit' ? 'BOUGHT' : 'SOLD'}
          </div>
          <div className='text-warning text-uppercase'>{equityType}</div>
        </div>

        <div className='d-flex align-items-center fw-bold fs-8'>
          <div className='bg-white-gray-600 bg-opacity-50 text-white-gray-600 rounded-start-2 p-2 text-center'>
            <div className='opacity-50 text-gray-600'>Price Loss</div>

            <div className='fs-5'>{`$${getTradePrice(
              equityType,
              profitOrLossDifference
            )}`}</div>
          </div>

          <div className='bg-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2 text-center'>
            <div className='fs-5 text-danger'>{`${profitOrLossPercentage}%`}</div>
            <div className='text-white-gray-600 opacity-50'>
              {`% ${profitOrLossPercentage >= 0 ? 'Profit' : 'Loss'}`}
            </div>
          </div>
        </div>
      </div>

      <div className='separator separator-solid my-3 mx-2 d-xl-none' />

      {/* Data Display */}
      <div className='p-2 w-100'>
        <div className='d-flex align-items-center justify-content-between mb-2'>
          <div
            className={`rounded-2 w-80px text-center py-1  fw-bold fs-7 ${
              transactionType === 'Debit' ? 'bg-success' : 'bg-danger'
            }`}
          >
            {transactionType === 'Debit' ? 'BOUGHT' : 'SOLD'}
          </div>

          <div className='d-flex align-items-center fw-semibold fs-8'>
            <div className='bg-gray-600 text-white-gray-600 rounded-start-2 p-2'>
              {expDate}
            </div>

            <div className='bg-white-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2'>
              {`${openDays}D`}
            </div>
          </div>

          <div className='d-flex align-items-center fw-semibold fs-8'>
            <div className='bg-gray-600 text-white-gray-600 rounded-start-2 p-2'>
              {`$${strikePrice}`}
            </div>
            <div className='bg-white-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2'>
              {tradeDirection}
            </div>
          </div>

          <div className='d-flex align-items-center fw-semibold fs-8 gap-2'>
            <div>@</div>
            <div className='bg-gray-600 text-white-gray-600 rounded-2 p-2'>
              {`$${entryPrice}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
