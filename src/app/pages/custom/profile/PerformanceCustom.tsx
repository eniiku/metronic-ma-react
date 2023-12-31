import { useQuery } from 'react-query'
import {
  fetchAdditionalStats,
  fetchAllUsers,
  fetchAssetsTradedStats,
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

  // const { data: CumulativeStats, isLoading: isCumulativeStatsLoading } =
  //   useQuery('cumulativeStats', fetchCumulativeStats)

  // console.log('CumulativeStats: ', CumulativeStats)
  return (
    <>
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
    </>
  )
}

export default PerformanceCustom
