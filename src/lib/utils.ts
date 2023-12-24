import _ from 'lodash'
import { AuthModel } from '../app/modules/auth'

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
      return JSON.parse(part.substring(name.length, part.length))
    }
  }
  return undefined
}
