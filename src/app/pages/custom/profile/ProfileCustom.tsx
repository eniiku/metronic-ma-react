import { useQuery } from 'react-query'
import {
  fetchAllUsers,
  fetchAssetsTradedStats,
  fetchStatistics,
} from '../../../../services/api'
import { TablesWidgetCustom } from '../../../../_metronic/partials/widgets/custom/TableWidgetCustom'
import { ChartsWidgetCustom } from '../../../../_metronic/partials/widgets/charts/ChartsWidgetCustom'
import { useEffect, useState } from 'react'

const ProfileCustom: React.FC<{ userId: string }> = ({ userId }) => {
  const {
    data: statistics,
    isLoading,
    isError,
  } = useQuery('statistics', () => fetchStatistics(userId))

  const [statisticsData, setStatisticsData] = useState(statistics)
  const [isStatsLoading, setIsStatsLoading] = useState(isLoading)
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all_time')

  const { data: users } = useQuery('users', fetchAllUsers)

  const {
    data: assetsTradedStats,
    isLoading: isAssetTradedLoading,
    isError: isAssetTradedError,
  } = useQuery('assetsTradedStats', () => fetchAssetsTradedStats(userId))

  const assetsTradedStatsData = assetsTradedStats?.data?.assetTrades

  const currentUser = users?.data.find((user: any) => user._id === userId)

  useEffect(() => {
    setStatisticsData(statistics)
    setIsStatsLoading(isLoading)
  }, [statistics, isLoading])

  return (
    <>
      {currentUser?.profileDescription ? (
        <div className='card card-flush mb-8'>
          <div className='card-header'>
            <h1 className='card-title fw-bold fs-4'>Profile Description</h1>
          </div>

          <div className='card-body pt-0 fs-5 text-muted mw-900px'>
            {currentUser ? currentUser.profileDescription : 'NIl'}
          </div>
        </div>
      ) : null}

      <TablesWidgetCustom
        data={statisticsData?.data}
        userId={userId}
        action={setStatisticsData}
        loader={setIsStatsLoading}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        isLoading={isStatsLoading}
        isError={isError}
        className='mb-8'
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
    </>
  )
}

export default ProfileCustom
