import _ from 'lodash'
import { AuthModel } from '../app/modules/auth'
import moment from 'moment'

export const getTradePrice = (
  equityType: string,
  profitLosssPercent: number
) => {
  let price = ''
  if (equityType == 'Option') {
    price = profitLosssPercent * 100 + ''
  } else price = profitLosssPercent + ''
  if (price.includes('-')) price = price.replace('-', '')
  else price
  return !_.isEmpty(price) ? parseFloat(price).toFixed(2) : price
}

export function getForexTicker(ticker: string) {
  if (!ticker) {
    return ''
  }
  if (ticker?.includes('&#X2F;')) {
    const first = ticker.split('&')[0]
    const second = ticker.split('&')[1]
    const last = second.split(';')[1]
    return first + '/' + last
  } else return ticker
}

export function calculateDifference(
  btcOrStc: string,
  regularMarketPrice: number,
  avgPrice: number
) {
  let profitOrLossOperatorMultiplier = 1
  if (btcOrStc == 'BTC') {
    if (regularMarketPrice < avgPrice) {
      //profit
      profitOrLossOperatorMultiplier = 1
    } else {
      //loss
      profitOrLossOperatorMultiplier = -1
    }
  } else {
    //STC
    if (regularMarketPrice > avgPrice) {
      //profit
      profitOrLossOperatorMultiplier = 1
    } else {
      //loss
      profitOrLossOperatorMultiplier = -1
    }
  }
  const priceDiff = (
    (regularMarketPrice - avgPrice) *
    profitOrLossOperatorMultiplier
  )
    .toFixed(2)
    .toString()

  return {
    percentage:
      Math.abs(((regularMarketPrice - avgPrice) / avgPrice) * 100) *
      profitOrLossOperatorMultiplier,
    profitOrLoss:
      (regularMarketPrice - avgPrice) * profitOrLossOperatorMultiplier,
    // profitOrLoss: priceDiff.includes("-") ? priceDiff.replace("-", "") : priceDiff
  }
}

// Save to Cookies
export const saveToCookies = (auth: AuthModel) => {
  document.cookie = `auth=${JSON.stringify(auth)}; secure; samesite=strict`
  console.log('Saved to cookies')
}

// Get from Cookies
export const getFromCookies = (): AuthModel | undefined => {
  const name = 'auth='
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieParts = decodedCookie.split(';')
  for (let i = 0; i < cookieParts.length; i++) {
    const part = cookieParts[i].trim()
    if (part.indexOf(name) === 0) {
      const cookieData = JSON.parse(part.substring(name.length, part.length))

      // Check the age of the cookie
      const cookieCreationDate = new Date(cookieData.creationDate)
      const currentDate = new Date()
      const sevenDaysAgo = new Date(
        currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
      )

      if (cookieCreationDate < sevenDaysAgo) {
        // Delete the expired cookie
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict`
        console.log('Expired cookie deleted')
        return undefined
      } else {
        return cookieData
      }
    }
  }
  return undefined
}

export function getStartEndDate(filterDays: string) {
  const today = moment().format('YYYY-MM-DD')

  const dateRanges: Record<string, { startDate: string; endDate: string }> = {
    all_time: { startDate: '', endDate: '' },
    today: { startDate: today, endDate: today },
    yesterday: {
      startDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      endDate: today,
    },
    this_week: {
      startDate: moment().startOf('week').format('YYYY-MM-DD'),
      endDate: today,
    },
    last_week: {
      startDate: moment()
        .subtract(1, 'weeks')
        .startOf('week')
        .format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
    },
    this_month: {
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: today,
    },
    last_month: {
      startDate: moment()
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD'),
    },
    this_quarter: {
      startDate: moment()
        .subtract(3, 'months')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: today,
    },
    last_quarter: {
      startDate: moment()
        .subtract(6, 'months')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .subtract(3, 'months')
        .endOf('month')
        .format('YYYY-MM-DD'),
    },
    this_year: {
      startDate: moment().startOf('year').format('YYYY-MM-DD'),
      endDate: today,
    },
    last_year: {
      startDate: moment()
        .subtract(1, 'years')
        .startOf('year')
        .format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD'),
    },
  }

  return dateRanges[filterDays]
}

export const getAvgValue = (arr: number[]) => {
  const newAvg =
    arr.reduce((p, n) => {
      return p + n
    }) / arr.length
  return newAvg ? newAvg?.toFixed(4) : 0
}

export const getCallPut = (tradeSummaryData: any) => {
  let tradeDirection = ''
  if (tradeSummaryData?.equityType === 'Option') {
    const tickerCode = tradeSummaryData?.ticker?.split('_')[1]
    tradeDirection = tickerCode?.substring(6, 7)
  } else {
    if (tradeSummaryData?.tradeDirection == 'BTO') tradeDirection = 'C'
    else tradeDirection = 'P'
  }
  return tradeDirection
}

export const getEntryPrice = (tradeSummaryData: any) => {
  let entryPrice = 0
  if (tradeSummaryData && tradeSummaryData?.entryPrice) {
    if (tradeSummaryData?.equityType == 'Crypto') {
      entryPrice = tradeSummaryData?.entryPrice?.toFixed(4)
    } else entryPrice = tradeSummaryData?.entryPrice?.toFixed(2)
  } else entryPrice = 0
  return entryPrice
}

export const getStrikePrice = (tradeSummaryData: any) => {
  if (tradeSummaryData && tradeSummaryData?.ticker) {
    const tickerCode = tradeSummaryData?.ticker?.split('_')[1]
    const strikePrice = tickerCode?.substring(7)
    return strikePrice
  } else return ''
}

export const getDaysOpen = (tradeSummaryData: any) => {
  if (tradeSummaryData) {
    const tickerCode = tradeSummaryData?.ticker?.split('_')[1]
    const month = tickerCode?.substring(0, 2)
    const date = tickerCode?.substring(2, 4)
    const year = tickerCode?.substring(4, 6)
    const expiryDate = month + '/' + date + '/' + year

    const given = moment(expiryDate, 'MM/DD/YYYY')
    const current = moment().startOf('day')
    const daysOpens = moment.duration(given.diff(current)).asDays()
    const openDays = Math.floor(daysOpens)
    return openDays
  } else return 0
}

export const getExpiryDate = (tradeSummaryData: any) => {
  if (tradeSummaryData) {
    const tickerCode = tradeSummaryData?.ticker?.split('_')[1]
    const month = tickerCode?.substring(0, 2)
    const date = tickerCode?.substring(2, 4)
    const year = tickerCode?.substring(4, 6)
    const expiryDate = month + '/' + date + '/' + year
    const expDate = moment(expiryDate, 'MM/DD/YYYY').format('MMM DD')
    return expDate
  } else return moment(new Date()).format('MMM DD')
}

export const returnPosition = (pos: string) => {
  switch (pos) {
    case 'buy':
      return 'BTO'
    case 'sell':
      return 'STC'
    case 'short':
      return 'STO'
    case 'cover':
      return 'BTC'
    default:
      return ''
  }
}

export const getOptionChainData = async (optionChainData: any) => {
  const callObj = optionChainData?.callExpDateMap
    ? optionChainData?.callExpDateMap
    : {}
  const putObj = optionChainData?.putExpDateMap
    ? optionChainData?.putExpDateMap
    : {}
  const callDatesArray: any = []
  const putDatesArray: any = []
  let optionData = []
  try {
    await _.each(callObj, function (val, key) {
      const strikeArray: any = []
      _.each(val, function (subVal, subKey) {
        strikeArray.push({ strike_price: subKey, callData: subVal[0] })
      })
      callDatesArray.push({ date: key, strike_data: strikeArray })
    })

    await _.each(putObj, function (val, key) {
      const putStrikeArray: any = []
      _.each(val, function (subVal, subKey) {
        putStrikeArray.push({ strike_price: subKey, putData: subVal[0] })
      })
      putDatesArray.push({ date: key, strike_data: putStrikeArray })
    })

    optionData = callDatesArray.map((item: any, index: any) => {
      console.log({ item })
      const putStrikeArray = putDatesArray[index]?.strike_data
      const data = item.strike_data.map((x: any, i: any) => {
        const putData = putStrikeArray[i].putData
        return { ...x, putData: putData }
      })
      return { ...item, strike_data: data }
    })
    console.log({ optionData })
    return {
      optionCallData: callDatesArray,
      optionPutData: putDatesArray,
      optionData: optionData,
    }
  } catch (error) {
    return {
      optionCallData: [],
      optionPutData: [],
      optionData: [],
    }
  }
}
