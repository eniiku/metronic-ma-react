import React from 'react'
import { DropdownCustomTimeframe } from '../../content/dropdown/DropdownCustomTimeframe'

type DataProps = {
  assetName: string
  averageLoss: { formatted: string; value: number }
  averageProfit: { formatted: string; value: number }
  averageReturnPerTrade: { formatted: string; value: number }
  maxLoss: { formatted: string; value: number }
  maxProfit: { formatted: string; value: number }
  trades: number
  winRate: { formatted: string; value: number }
}

type Props = {
  className: string
  data: DataProps[]
  userId: string
  action: React.Dispatch<any>
  loader: React.Dispatch<any>
  selectedTimeframe: string
  setSelectedTimeframe: (value: string) => void
}

export const TablesWidgetCustom: React.FC<Props> = ({
  className,
  data,
  userId,
  action,
  loader,
  selectedTimeframe,
  setSelectedTimeframe,
}) => {
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe)
  }

  const getTextColor = (value: number) => {
    return value > 0
      ? 'text-success'
      : value < 0
      ? 'text-danger'
      : 'text-gray-900'
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Trade Statistics</span>
        </h3>

        <div className='m-0'>
          <button
            className='btn btn-sm btn-outline btn-outline-default fw-bold text-capitalize'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            {/* Display the selected timeframe dynamically */}
            TimeFrame: {selectedTimeframe?.replace('_', ' ')}
          </button>

          <DropdownCustomTimeframe
            id={userId}
            setData={action}
            setLoader={loader}
            onTimeframeChange={handleTimeframeChange}
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
          />
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4 text-center'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='min-w-125px rounded-start'>Asset</th>
                <th className='min-w-125px'>Total Trades</th>
                <th className='min-w-125px'>Avg Loss</th>
                <th className='min-w-125'>Avg Profit</th>
                <th className='min-w-125px'>Avg Return</th>
                <th className='min-w-125px'>Win Rate</th>
                <th className='min-w-125px'>Max Loss</th>
                <th className='min-w-125px rounded-end'>Max Profit</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {data?.map((item) => (
                <tr key={item.assetName}>
                  <td>
                    <div className=' fw-bold text-hover-primary mb-1 fs-6'>
                      {item.assetName}
                    </div>
                  </td>
                  <td>
                    <div className=' fw-bold text-hover-primary mb-1 fs-6'>
                      {item.trades}
                    </div>
                  </td>
                  <td>
                    <div
                      className={` fw-bold text-hover-primary mb-1 fs-6 ${getTextColor(
                        item.averageLoss.value
                      )}`}
                    >
                      {item.averageLoss.formatted}
                    </div>
                  </td>
                  <td>
                    <div
                      className={`fw-bold text-hover-primary mb-1 fs-6 ${getTextColor(
                        item.averageProfit.value
                      )}`}
                    >
                      {item.averageProfit.formatted}
                    </div>
                  </td>
                  <td>
                    <div
                      className={` fw-bold text-hover-primary mb-1 fs-6 ${getTextColor(
                        item.averageReturnPerTrade.value
                      )}`}
                    >
                      {item.averageReturnPerTrade.formatted}
                    </div>
                  </td>
                  <td>
                    <div
                      className={` fw-bold text-hover-primary mb-1 fs-6 ${getTextColor(
                        item.winRate.value
                      )}`}
                    >
                      {item.winRate.formatted}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                      {item.maxLoss.formatted}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                      {item.maxProfit.formatted}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
