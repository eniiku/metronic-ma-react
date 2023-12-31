import { useQuery } from 'react-query'
import {
  fetchAdditionalStats,
  fetchAllUsers,
  fetchCumulativeStats,
  fetchStatistics,
} from '../../../../services/api'
import { MixedWidgetCustom } from '../../../../_metronic/partials/widgets/custom/MixedWidgetCustom'
import { TablesWidgetCustom } from '../../../../_metronic/partials/widgets/custom/TableWidgetCustom'
import { StatisticsWidget5 } from '../../../../_metronic/partials/widgets'
import moment from 'moment'
import { ChartsWidgetCustom } from '../../../../_metronic/partials/widgets/charts/ChartsWidgetCustom'

type AdditionalProps = {
  profitableWeeksPercentage: {
    formatted: string
    value: number
  }
  avgTradesPerWeek: number
  avgHoldingTimeDays: number
}

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

  console.log('Additional', additionalStats)

  // Get current displayed user info
  const { data: users } = useQuery('users', fetchAllUsers)

  const currentUser = users?.data.find((user: any) => user._id === userId)

  // const { data: CumulativeStats, isLoading: isCumulativeStatsLoading } =
  //   useQuery('cumulativeStats', fetchCumulativeStats)

  // console.log('CumulativeStats: ', CumulativeStats)
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className='text-center fs-2 py-5'>Error fetching table data</div>
      ) : (
        <TablesWidgetCustom className='mb-8' data={statistics.data} />
      )}

      {/*  Additional Stats */}
      <div className='card card-flush'>
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
    </>
  )
}

export default PerformanceCustom
