import { FC } from 'react'
import { useQuery } from 'react-query'
import { fetchAllTradeSummary } from '../../../services/api'
import { TradeWidget } from '../../../_metronic/partials/widgets/custom/TradeWidget'
import { ToolbarCustom } from '../../../_metronic/layout/components/toolbar/toolbars'

const DashboardPage: FC = () => {
  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery('summary', fetchAllTradeSummary)

  return (
    <>
      <ToolbarCustom />

      {/* custom begin::Row */}
      <div className='row gy-5 g-xl-8 mb-5 mb-xl-10'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          summary.data.summary_data.map((summary: any) => (
            <div key={summary._id}>
              <TradeWidget
                data={summary}
                className='card-xl-stretch mb-xl-8 justify-content-between gap-xl-5 flex-xl-row align-items-xl-center'
              />
            </div>
          ))
        )}

        {isError ? <div>Error Loading Trades</div> : null}
      </div>
      {/* custom end::Row */}
    </>
  )
}

const DashboardWrapper: FC = () => {
  return (
    <>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
