import { useQuery } from 'react-query'
import {
  fetchCumulativeStats,
  fetchStatistics,
} from '../../../../../services/api'
import { MixedWidgetCustom } from '../../../../../_metronic/partials/widgets/custom/MixedWidgetCustom'
import { TablesWidgetCustom } from '../../../../../_metronic/partials/widgets/custom/TableWidgetCustom'

const Performance = () => {
  const { data: statistics, isLoading } = useQuery(
    'statistics',
    fetchStatistics
  )

  // const { data: CumulativeStats, isLoading: isCumulativeStatsLoading } =
  //   useQuery('cumulativeStats', fetchCumulativeStats)

  // console.log('CumulativeStats: ', CumulativeStats)
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <TablesWidgetCustom className='mb-8' data={statistics.data} />
      )}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        {/* begin::Col */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          statistics.data.map((item: any) => (
            <div key={item._id} className='col-xl-4'>
              <MixedWidgetCustom
                className='card-xl-stretch mb-xl-8'
                data={item}
              />
            </div>
          ))
        )}
        {/* end::Col */}
      </div>
      {/* end::Row */}
    </>
  )
}

export default Performance
