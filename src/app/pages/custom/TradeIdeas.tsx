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
    <div className='row gy-5 g-xl-8 mb-5 mb-xl-10'>
      <TradeWidget
        data={trades?.data}
        showTitle={true}
        isLoading={isLoading}
        isError={isError}
        isFilterLoading={false}
        className='card-xl-stretch mb-xl-8'
      />
    </div>
  )
}

export default TradeIdeas
