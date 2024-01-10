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
    percentage: (
      Math.abs(((regularMarketPrice - avgPrice) / avgPrice) * 100) *
      profitOrLossOperatorMultiplier
    ).toFixed(2),
    profitOrLoss: (
      (regularMarketPrice - avgPrice) *
      profitOrLossOperatorMultiplier
    ).toFixed(2),
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
