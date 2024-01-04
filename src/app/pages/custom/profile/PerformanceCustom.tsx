import { useQuery } from 'react-query'
import {
  fetchAdditionalStats,
  fetchAllUsers,
  fetchAssetsTradedStats,
  fetchAvgRiskStats,
  fetchCumulativeStats,
  fetchFrequentlyTradedStats,
  fetchStatistics,
  fetchTradeDirectionStats,
} from '../../../../services/api'
import { TablesWidgetCustom } from '../../../../_metronic/partials/widgets/custom/TableWidgetCustom'
import { StatisticsWidget5 } from '../../../../_metronic/partials/widgets'
import moment from 'moment'
import { ChartsWidgetCustom } from '../../../../_metronic/partials/widgets/charts/ChartsWidgetCustom'
import { StatisticsWidgetCustom } from '../../../../_metronic/partials/widgets/statistics/StatisticsWidgetCustom'
import { useEffect, useState } from 'react'
import { ChartsWidgetCustom1 } from '../../../../_metronic/partials/widgets/charts/ChartsWidgetCustom1'

// type AdditionalProps = {
//   profitableWeeksPercentage: {
//     formatted: string
//     value: number
//   }
//   avgTradesPerWeek: number
//   avgHoldingTimeDays: number
// }

const PerformanceCustom: React.FC<{ userId: string }> = ({ userId }) => {
  const {
    data: statistics,
    isLoading,
    isError,
  } = useQuery('statistics', () => fetchStatistics(userId))

  const {
    data: additionalStats,
    isLoading: isAdditionalLoading,
    isError: isAdditionalError,
  } = useQuery('additionalStats', () => fetchAdditionalStats(userId))

  const {
    data: tradeDirectionStats,
    isLoading: istradeDirectionLoading,
    isError: istradeDirectionError,
  } = useQuery('tradeDirectionStats', () => fetchTradeDirectionStats(userId))

  const {
    data: assetsTradedStats,
    isLoading: isAssetTradedLoading,
    isError: isAssetTradedError,
  } = useQuery('assetsTradedStats', () => fetchAssetsTradedStats(userId))

  const assetsTradedStatsData = assetsTradedStats?.data.assetTrades

  const {
    data: frequentlyTraded,
    isLoading: isFrequentlyTradedLoading,
    isError: isFrequentlyTradedError,
  } = useQuery('frequentlyTraded', () => fetchFrequentlyTradedStats(userId))

  // Get current displayed user info
  const { data: users } = useQuery('users', fetchAllUsers)

  const currentUser = users?.data.find((user: any) => user._id === userId)

  const {
    data: cumulativeStats,
    isLoading: isCumulativeStatsLoading,
    isError: isCumulativeStatsError,
  } = useQuery('cumulativeStats', () => fetchCumulativeStats(userId))

  const {
    data: avgRiskStats,
    isLoading: isAvgRiskStatsLoading,
    isError: isAvgRiskStatsError,
  } = useQuery('avgRiskStats', () => fetchAvgRiskStats(userId))

  console.log('CumulativeStats: ', cumulativeStats)
  console.log('AvgStats: ', avgRiskStats)

  const [comData, setComData] = useState<{
    labels: string[]
    datasets: { data: number[] }[]
  }>({
    labels: [],
    datasets: [{ data: [] }],
  })

  const [avgRiskData, setAvgRiskData] = useState<{
    labels: string[]
    datasets: { data: number[] }[]
  }>({
    labels: [],
    datasets: [{ data: [] }],
  })

  useEffect(() => {
    console.log('Updating data...')
    console.log('cumulativeStats:', cumulativeStats)
    console.log('avgRiskStats:', avgRiskStats)

    if (cumulativeStats && cumulativeStats.data?.length > 0) {
      const labels = cumulativeStats.data.map((x: any) => x.key)
      const datasets = [
        {
          data: cumulativeStats.data.map(
            (x: any) => x?.profitOrLossDifference.value
          ),
        },
      ]

      console.log('Setting comData:', { labels, datasets })
      setComData({ labels, datasets })
    } else {
      console.log('Setting comData to default.')
      setComData({ labels: [], datasets: [{ data: [] }] })
    }

    if (avgRiskStats) {
      const labels = [
        'Daily Risk',
        'Weekly Risk',
        'Monthly Risk',
        'Yearly Risk',
      ]
      const datasets = [
        {
          data: [
            avgRiskStats.data.dailyRisk?.average?.value || 0,
            avgRiskStats.data.weeklyRisk?.average?.value || 0,
            avgRiskStats.data.monthlyRisk?.average?.value || 0,
            avgRiskStats.data.yearlyRisk?.average?.value || 0,
          ],
        },
      ]

      console.log('Setting avgRiskData:', { labels, datasets })
      setAvgRiskData({ labels, datasets })
    }
  }, [cumulativeStats, avgRiskStats])

  console.log('cumulative', comData)
  console.log('avgRiskData: ', avgRiskData)

  return (
    <>
      {/* Cumulative Pl */}
      {isCumulativeStatsLoading ? (
        <div>Loading...</div>
      ) : isCumulativeStatsError ? (
        <div>Error fetching cumulative pl</div>
      ) : (
        <ChartsWidgetCustom1
          className='mb-8'
          labels={comData.labels}
          datasets={comData.datasets}
          title='Cumulative P&L'
          color='--bs-info'
        />
      )}

      {/* Assets Traded */}
      {isAssetTradedLoading ? (
        <div>Loading...</div>
      ) : isAssetTradedError ? (
        <div>Error fetching additional statistics</div>
      ) : (
        <ChartsWidgetCustom
          className='mb-8'
          title='Trade Direction'
          seriesData={[
            {
              name: 'Crypto',
              data: [assetsTradedStatsData.cryptoValue.toFixed(2)],
            },
            {
              name: 'Forex',
              data: [assetsTradedStatsData.forexValue.toFixed(2)],
            },
            {
              name: 'Option',
              data: [assetsTradedStatsData.optionValue.toFixed(2)],
            },
            {
              name: 'Stock',
              data: [assetsTradedStatsData.stockValue.toFixed(2)],
            },
          ]}
        />
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className='text-center fs-2 py-5'>Error fetching table data</div>
      ) : (
        <TablesWidgetCustom className='mb-8' data={statistics.data} />
      )}

      {/* Trade Direction */}
      {istradeDirectionLoading ? (
        <div>Loading...</div>
      ) : istradeDirectionError ? (
        <div>Error fetching trade direction chart data</div>
      ) : (
        <ChartsWidgetCustom
          className='mb-8'
          title='Trade Direction'
          seriesData={[
            {
              name: 'Long',
              data: [tradeDirectionStats.data.longPercentage.value],
            },
            {
              name: 'Short',
              data: [tradeDirectionStats.data.shortPercentage.value],
            },
          ]}
        />
      )}

      {/*  Additional Stats */}
      <div className='card card-flush mb-8'>
        <div className='card-header'>
          <h1 className='card-title fw-bold fs-3 mb-1'>Additional Stats</h1>
        </div>
        {/* begin::Row */}
        {isAdditionalLoading ? (
          <div>Loading...</div>
        ) : isAdditionalError ? (
          <div>Error fetching additional statistics</div>
        ) : (
          <div className='row card-body py-3 g-5 g-xl-8'>
            <div className='col-md-6 col-xl-3'>
              <StatisticsWidget5
                className='card-xl-stretch mb-xl-8'
                svgIcon='calendar'
                color='white'
                iconColor='primary'
                title={`${
                  additionalStats ? additionalStats.data.avgTradesPerWeek : '--'
                } Trades`}
                titleColor='dark'
                description='Per Week'
                descriptionColor='dark'
              />
            </div>

            <div className='col-md-6 col-xl-3'>
              <StatisticsWidget5
                className='card-xl-stretch mb-xl-8'
                svgIcon='time'
                color='dark'
                iconColor='white'
                title={`${
                  additionalStats
                    ? additionalStats.data.avgHoldingTimeDays
                    : '--'
                } Days`}
                titleColor='white'
                description='Avg Holding Time'
                descriptionColor='white'
              />
            </div>

            <div className='col-md-6 col-xl-3'>
              <StatisticsWidget5
                className='card-xl-stretch mb-xl-8'
                svgIcon='briefcase'
                color='warning'
                iconColor='white'
                title={`${
                  additionalStats
                    ? additionalStats.data.profitableWeeksPercentage.formatted
                    : '--'
                }`}
                titleColor='white'
                description='Profitable Weeks'
                descriptionColor='white'
              />
            </div>

            <div className='col-md-6 col-xl-3'>
              <StatisticsWidget5
                className='card-xl-stretch mb-5 mb-xl-8'
                svgIcon='user'
                color='info'
                iconColor='white'
                title={`${
                  currentUser
                    ? moment(currentUser.createdAt).format('DD MMM YY')
                    : '--'
                } `}
                titleColor='white'
                description='Active since'
                descriptionColor='white'
              />
            </div>
          </div>
        )}
        {/* end::Row */}
      </div>

      {/* Frequently Traded Tickers */}
      <div className='card card-flush mb-9'>
        <div className='card-header'>
          <h1 className='card-title fw-bold fs-3 mb-1'>
            Frequently Traded Ticker
          </h1>
        </div>
        {/* begin::Row */}

        <div className='row card-body pt-0 g-5 g-xl-8'>
          {isFrequentlyTradedLoading ? (
            <div>Loading...</div>
          ) : frequentlyTraded?.data.length > 0 ? (
            frequentlyTraded.data.map(
              (trade: { ticker: string; totalTrades: number }) => (
                <div key={trade.ticker} className='col-6 col-md-3 col-xl-2'>
                  <StatisticsWidgetCustom
                    className='card-xl-stretch mb-xl-8'
                    color='light'
                    title={`${trade ? trade.ticker : '--'}`}
                    titleColor='white'
                    description={`Trade Count: ${trade.totalTrades}`}
                    descriptionColor='muted'
                  />
                </div>
              )
            )
          ) : isFrequentlyTradedError ? (
            <div>Error fetching frequently traded tickers</div>
          ) : (
            <div className='text-center fs-3 py-5'>
              This user currently has no frequently traded tickers
            </div>
          )}
        </div>
        {/* end::Row */}
      </div>

      {/* Avg Risk */}
      {isAvgRiskStatsLoading ? (
        <div>Loading...</div>
      ) : isAvgRiskStatsError ? (
        <div>Error fetching average statistics</div>
      ) : (
        <ChartsWidgetCustom1
          className='mb-8'
          labels={avgRiskData.labels}
          datasets={avgRiskData.datasets}
          title='Average Risk'
          color='--bs-danger'
        />
      )}
    </>
  )
}

export default PerformanceCustom
