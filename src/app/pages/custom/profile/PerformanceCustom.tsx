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
import { Loading } from '../../../components/Loading'
import NoData from '../../../components/NoData'
import { set } from 'lodash'

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

  const [statisticsData, setStatisticsData] = useState(statistics)
  const [isStatsLoading, setIsStatsLoading] = useState(isLoading)
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all_time')

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
    setStatisticsData(statistics)
    setIsStatsLoading(isLoading)
  }, [statistics, isLoading])

  useEffect(() => {
    if (cumulativeStats && cumulativeStats.data?.length > 0) {
      const labels = cumulativeStats.data.map((x: any) => x.key)
      const datasets = [
        {
          data: cumulativeStats.data.map(
            (x: any) => x?.profitOrLossDifference.value
          ),
        },
      ]

      setComData({ labels: labels, datasets: datasets })
    }
  }, [cumulativeStats])

  useEffect(() => {
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

      setAvgRiskData({ labels: labels, datasets: datasets })
    }
  }, [avgRiskStats])

  return (
    <>
      {/* Cumulative Pl */}

      <ChartsWidgetCustom1
        className='mb-8'
        seriesData={comData}
        title='Cumulative P&L'
        color='--bs-info'
        data={cumulativeStats?.data}
        isLoading={isCumulativeStatsLoading}
        isError={isCumulativeStatsError}
      />

      {/* Assets Traded */}
      <ChartsWidgetCustom
        className='mb-8'
        title='Assets Traded'
        isLoading={isAssetTradedLoading}
        isError={isAssetTradedError}
        colors={['--bs-success', '--bs-warning', '--bs-primary', '--bs-info']}
        seriesData={[
          {
            name: 'Option',
            data: [assetsTradedStatsData?.optionValue?.toFixed(2)],
          },
          {
            name: 'Stock',
            data: [assetsTradedStatsData?.stockValue?.toFixed(2)],
          },
          {
            name: 'Forex',
            data: [assetsTradedStatsData?.forexValue?.toFixed(2)],
          },
          {
            name: 'Crypto',
            data: [assetsTradedStatsData?.cryptoValue?.toFixed(2)],
          },
        ]}
      />

      <TablesWidgetCustom
        className='mb-8'
        data={statisticsData?.data}
        userId={userId}
        action={setStatisticsData}
        loader={setIsStatsLoading}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        isLoading={isStatsLoading}
        isError={isError}
      />

      {/* Trade Direction */}
      <ChartsWidgetCustom
        className='mb-8'
        title='Trade Direction'
        isLoading={istradeDirectionLoading}
        isError={istradeDirectionError}
        colors={['--bs-danger', '--bs-success']}
        seriesData={[
          {
            name: 'Long',
            data: [tradeDirectionStats?.data?.longPercentage?.value],
          },
          {
            name: 'Short',
            data: [tradeDirectionStats?.data?.shortPercentage?.value],
          },
        ]}
      />

      {/*  Additional Stats */}
      <div className='card card-flush mb-8'>
        <div className='card-header'>
          <h1 className='card-title fw-bold fs-3 mb-1'>Additional Stats</h1>
        </div>
        {/* begin::Row */}
        {isAdditionalLoading ? (
          <Loading />
        ) : isAdditionalError ? (
          <NoData type='error' message='Error fetching additional statistics' />
        ) : (
          <div className='row card-body py-3 g-5 g-xl-8'>
            <div className='col-md-6 col-xl-3'>
              <StatisticsWidget5
                className='card-xl-stretch mb-xl-8'
                svgIcon='calendar'
                color='white'
                iconColor='primary'
                title={`${
                  additionalStats
                    ? additionalStats?.data?.avgTradesPerWeek
                    : '--'
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
                    ? additionalStats?.data?.avgHoldingTimeDays
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
                color='success'
                iconColor='white'
                title={`${
                  additionalStats
                    ? additionalStats?.data?.profitableWeeksPercentage
                        ?.formatted
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
                    ? moment(currentUser?.createdAt).format('DD MMM YY')
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
            <Loading />
          ) : frequentlyTraded?.data.length > 0 ? (
            frequentlyTraded.data.map(
              (trade: { ticker: string; totalTrades: number }) => (
                <div key={trade.ticker} className='col-6 col-md-3 col-xl-2'>
                  <StatisticsWidgetCustom
                    className='card-xl-stretch mb-xl-8'
                    color='light'
                    title={`${trade ? trade.ticker : '--'}`}
                    titleColor='text-gray-500'
                    description={`Trade Count: ${trade.totalTrades}`}
                    descriptionColor='muted'
                  />
                </div>
              )
            )
          ) : isFrequentlyTradedError ? (
            <NoData
              type='error'
              message='Error fetching frequently traded tickers'
            />
          ) : (
            <NoData
              type='info'
              message='This user currently has no frequently traded tickers'
            />
          )}
        </div>
        {/* end::Row */}
      </div>

      {/* Avg Risk */}

      <ChartsWidgetCustom1
        data={avgRiskStats?.data}
        className='mb-8'
        seriesData={avgRiskData}
        title='Average Risk'
        color='--bs-danger'
        isLoading={isAvgRiskStatsLoading}
        isError={isAvgRiskStatsError}
      />
    </>
  )
}

export default PerformanceCustom
