import React from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'

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
}

export const TablesWidgetCustom: React.FC<Props> = ({ className, data }) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Trade Statistics</span>
          {/* <span className='text-muted mt-1 fw-semibold fs-7'>
          </span> */}
        </h3>
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
              {data.map((item) => (
                <tr>
                  <td>
                    <div className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                      {item.assetName}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                      {item.trades}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                      {item.averageLoss.formatted}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                      {item.averageProfit.formatted}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                      {item.averageReturnPerTrade.formatted}
                    </div>
                  </td>
                  <td>
                    <div className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
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
