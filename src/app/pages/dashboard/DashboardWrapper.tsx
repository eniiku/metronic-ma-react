import { FC, useState } from 'react'
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

  const [tradesData, setTradesData] = useState(summary)

  return (
    <>
      <ToolbarCustom action={setTradesData} />

      {/* custom begin::Row */}
      <div className='row gy-5 g-xl-8 mb-5 mb-xl-10'>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error Loading Trades</div>
        ) : (
          <div>
            <TradeWidget
              data={tradesData?.data}
              showTitle={true}
              className='card-xl-stretch mb-xl-8'
            />
          </div>
        )}
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
