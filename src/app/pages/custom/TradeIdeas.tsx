import { useQuery } from 'react-query'
import { fetchUserTradeSummary } from '../../../services/api'
import { TradeWidget } from '../../../_metronic/partials/widgets/custom/TradeWidget'

const TradeIdeas = () => {
  const {
    data: trades,
    isLoading,
    isError,
  } = useQuery('trades', () => fetchUserTradeSummary())

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
            You have not created any trades.
          </div>
        )}
      </div>
      {/* custom end::Row */}
    </div>
  )
}

export default TradeIdeas
