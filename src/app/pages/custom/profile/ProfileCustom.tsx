import { useQuery } from 'react-query'
import {
  fetchAllUsers,
  fetchAssetsTradedStats,
  fetchStatistics,
} from '../../../../services/api'
import { TablesWidgetCustom } from '../../../../_metronic/partials/widgets/custom/TableWidgetCustom'
import { ChartsWidgetCustom } from '../../../../_metronic/partials/widgets/charts/ChartsWidgetCustom'

const ProfileCustom: React.FC<{ userId: string }> = ({ userId }) => {
  const {
    data: statistics,
    isLoading,
    isError,
  } = useQuery('statistics', () => fetchStatistics(userId))

  const { data: users } = useQuery('users', fetchAllUsers)

  const {
    data: assetsTradedStats,
    isLoading: isAssetTradedLoading,
    isError: isAssetTradedError,
  } = useQuery('assetsTradedStats', () => fetchAssetsTradedStats(userId))

  const assetsTradedStatsData = assetsTradedStats?.data.assetTrades

  const currentUser = users?.data.find((user: any) => user._id === userId)

  return (
    <>
      <div className='card card-flush mb-8'>
        <div className='card-header'>
          <h1 className='card-title fw-bold fs-4'>Profile Description</h1>
        </div>

        <div className='card-body pt-0 fs-5 text-muted mw-900px'>
          {currentUser ? currentUser.profileDescription : 'NIl'}
        </div>
      </div>

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
    </>
  )
}

export default ProfileCustom
