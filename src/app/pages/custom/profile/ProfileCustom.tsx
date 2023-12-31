import { useQuery } from 'react-query'
import {
  fetchAllUsers,
  fetchAssetsTradedStats,
  fetchStatistics,
  fetchUserTradeSummary,
} from '../../../../services/api'
import { TablesWidgetCustom } from '../../../../_metronic/partials/widgets/custom/TableWidgetCustom'
import { ChartsWidgetCustom } from '../../../../_metronic/partials/widgets/charts/ChartsWidgetCustom'
import { TradeWidget } from '../../../../_metronic/partials/widgets/custom/TradeWidget'

const ProfileCustom: React.FC<{ userId: string }> = ({ userId }) => {
  const {
    data: statistics,
    isLoading,
    isError,
  } = useQuery('statistics', () => fetchStatistics(userId))

  const {
    data: trades,
    isLoading: isTradeLoading,
    isError: isTradeError,
  } = useQuery('trades', () => fetchUserTradeSummary(userId))

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

      <div className='card card-flush'>
        <div className='card-header'>
          <div className='card-title fs-3'>Recent Trade Ideas</div>
        </div>

        <div className='card-body pt-0 row'>
          {isTradeLoading ? (
            <div>Loading...</div>
          ) : trades.data.summary_data.length > 0 ? (
            trades.data.summary_data
              .slice(0, 2)
              .map((trade: any, index: number) => (
                <div key={trade._id} className='col-6 col-xl-12'>
                  <TradeWidget
                    key={trade._id ? trade._id : index}
                    data={trade}
                    className='card-xl-stretch mb-xl-8 justify-content-between gap-xl-5 flex-xl-row align-items-xl-center'
                  />
                </div>
              ))
          ) : isTradeError ? (
            <div>Error Loading Trades</div>
          ) : (
            <div className='text-center fs-2 py-5'>
              This user had not created any trades.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfileCustom
