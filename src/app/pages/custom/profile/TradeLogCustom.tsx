import { useQuery } from 'react-query'
import { fetchUserTradeSummary } from '../../../../services/api'
import { TradeWidget } from '../../../../_metronic/partials/widgets/custom/TradeWidget'
import { FC } from 'react'

const TradeLogCustom: FC<{ userId: string }> = ({ userId }) => {
  const {
    data: trades,
    isLoading,
    isError,
  } = useQuery('trades', () => fetchUserTradeSummary(userId))

  return (
    <div>
      <div className='row gy-5 g-xl-8 mb-5 mb-xl-10'>
        {isLoading ? (
          <div>Loading...</div>
        ) : trades?.data?.summary_data?.length > 0 ? (
          <div>
            <TradeWidget
              data={trades?.data}
              showTitle={true}
              className='card-xl-stretch mb-xl-8'
            />
          </div>
        ) : isError ? (
          <div>Error Loading Trades</div>
        ) : (
          <div className='text-center fs-2 py-5'>
            This user has not created any trades.
          </div>
        )}
      </div>
      {/* custom end::Row */}
    </div>
  )
}

export default TradeLogCustom
