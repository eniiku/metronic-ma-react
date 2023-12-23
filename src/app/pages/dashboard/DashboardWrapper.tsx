import { FC } from 'react'
import { useIntl } from 'react-intl'
// import { toAbsoluteUrl } from '../../../_metronic/helpers'
import { PageTitle } from '../../../_metronic/layout/core'
// import {
// ListsWidget2,
// ListsWidget3,
// ListsWidget4,
// ListsWidget6,
// TablesWidget5,
// TablesWidget10,
// MixedWidget8,
// CardsWidget7,
// CardsWidget17,
// CardsWidget20,
// ListsWidget26,
// EngageWidget10,
// } from '../../../_metronic/partials/widgets'
import { useQuery } from 'react-query'
import { fetchAllTradeSummary } from '../../../services/api'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { TradeWidget } from '../../../_metronic/partials/widgets/custom/TradeWidget'

// import { toAbsoluteUrl } from '../../../_metronic/helpers'

const DashboardPage: FC = () => {
  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery('summary', fetchAllTradeSummary)

  return (
    <>
      <ToolbarWrapper />

      {/* custom begin::Row */}
      <div className='row gy-5 g-xl-8 mb-5 mb-xl-10'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          summary.data.summary_data.map((summary: any) => (
            <div>
              <TradeWidget
                key={summary._id}
                data={summary}
                className='card-xl-stretch mb-xl-8 justify-content-between gap-xl-5 flex-xl-row align-items-xl-center'
              />
            </div>
          ))
        )}

        {isError ? <div>Error Loading Trades</div> : null}

        {/* <div>
          <TradeWidget
            user={{ image: 'media/avatars/300-1.jpg', name: 'Henry Kiwa' }}
            className='card-xl-stretch mb-xl-8 justify-content-between gap-xl-5 flex-xl-row align-items-xl-center'
            trade={{
              title: 'DELL',
              percent: -98.81,
              price: 208.11,
            }}
            reason
          />
        </div>
        <div>
          <TradeWidget
            user={{ image: 'media/avatars/300-5.jpg', name: 'Timothee Tube' }}
            trade={{
              title: 'SPXW',
              percent: 2.94,
              price: 30.02,
            }}
            className='card-xl-stretch mb-xl-8 justify-content-between gap-xl-5 flex-xl-row align-items-xl-center'
          />
        </div> */}
      </div>
      {/* custom end::Row */}

      {/* custom begin::Row */}
      {/* <div className='row gy-5 g-xl-8 mb-5 mb-xl-10'>
        <div>
          <TradeWidget
            user={{ image: 'media/avatars/300-4.jpg', name: 'Willy Wonka' }}
            trade={{
              title: 'BTC',
              percent: 23.01,
              price: 408.09,
            }}
            className='card-xl-stretch mb-xl-8 justify-content-between gap-xl-5 flex-xl-row align-items-xl-center'
          />
        </div>
        <div>
          <TradeWidget
            user={{ image: 'media/avatars/300-7.jpg', name: 'Henry Danger' }}
            trade={{
              title: 'PTF',
              percent: 83.73,
              price: 18.03,
            }}
            className='card-xl-stretch mb-xl-8 justify-content-between gap-xl-5 flex-xl-row align-items-xl-center'
            reason
          />
        </div>
        <div>
          <TradeWidget
            trade={{
              title: 'NVUX',
              percent: 47.21,
              price: 112.47,
            }}
            user={{
              image: 'media/avatars/300-3.jpg',
              name: 'Timothee Chalamote',
            }}
            className='card-xl-stretch mb-xl-8 justify-content-between gap-xl-5 flex-xl-row align-items-xl-center'
            reason
          />
        </div>
      </div> */}
      {/* custom end::Row */}
    </>
  )
}

const DashboardWrapper: FC = () => {
  // const intl = useIntl()
  return (
    <>
      {/* <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'MENU.DASHBOARD' })}
      </PageTitle> */}
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }

// {/* begin::Row */}
// <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
//   {/* begin::Col */}
//   <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
//     <CardsWidget20
//       className='h-md-50 mb-5 mb-xl-10'
//       description='Active Projects'
//       color='#F1416C'
//       img={toAbsoluteUrl('media/patterns/vector-1.png')}
//     />
//     <CardsWidget7
//       className='h-md-50 mb-5 mb-xl-10'
//       description='Professionals'
//       icon={false}
//       stats={357}
//       labelColor='dark'
//       textColor='gray-300'
//     />
//   </div>
//   {/* end::Col */}

//   {/* begin::Col */}
//   <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
//     <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
//     <ListsWidget26 className='h-lg-50' />
//   </div>
//   {/* end::Col */}

//   {/* begin::Col */}
//   <div className='col-xxl-6'>
//     <EngageWidget10 className='h-md-100' />
//   </div>
//   {/* end::Col */}
// </div>
// {/* end::Row */}

// {/* begin::Row */}
// <div className='row gx-5 gx-xl-10'>
//   {/* begin::Col */}
//   <div className='col-xxl-6 mb-5 mb-xl-10'>
//     {/* <app-new-charts-widget8 cssclassName="h-xl-100" chartHeight="275px" [chartHeightNumber]="275"></app-new-charts-widget8> */}
//   </div>
//   {/* end::Col */}

//   {/* begin::Col */}
//   <div className='col-xxl-6 mb-5 mb-xl-10'>
//     {/* <app-cards-widget18 cssclassName="h-xl-100" image="./assetsmedia/stock/600x600/img-65.jpg"></app-cards-widget18> */}
//   </div>
//   {/* end::Col */}
// </div>
// {/* end::Row */}

// {/* begin::Row */}
// <div className='row gy-5 gx-xl-8'>
//   <div className='col-xxl-4'>
//     <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
//   </div>
//   <div className='col-xl-8'>
//     <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
//   </div>
// </div>
// {/* end::Row */}

// {/* begin::Row */}
// <div className='row gy-5 g-xl-8'>
//   <div className='col-xl-4'>
//     <ListsWidget2 className='card-xl-stretch mb-xl-8' />
//   </div>
//   <div className='col-xl-4'>
//     <ListsWidget6 className='card-xl-stretch mb-xl-8' />
//   </div>
//   <div className='col-xl-4'>
//     <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
//     {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' */}
//   </div>
// </div>
// {/* end::Row */}

// <div className='row g-5 gx-xxl-8'>
//   <div className='col-xxl-4'>
//     <MixedWidget8
//       className='card-xxl-stretch mb-xl-3'
//       chartColor='success'
//       chartHeight='150px'
//     />
//   </div>
//   <div className='col-xxl-8'>
//     <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
//   </div>
// </div>
