import { useEffect, useRef, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { KTIcon } from '../../../helpers'
import { getCSSVariableValue } from '../../../assets/ts/_utils'
import { Dropdown1 } from '../../content/dropdown/Dropdown1'

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
  data: DataProps
}

export const MixedWidgetCustom: FC<Props> = ({ className, data }) => {
  const iconType = (value: { formatted: string; value: number }) => {
    if (value.value > 0) {
      return { icon: 'arrow-up', color: 'text-success' }
    } else if (value.value === 0) {
      return { icon: '', color: '' }
    } else {
      return { icon: 'arrow-down', color: 'text-danger' }
    }
  }
  return (
    <div className={`card ${className}`}>
      {/* begin::Beader */}
      <div className='card-header border-0 py-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            {data.assetName} Overview
          </span>

          <span className='text-muted fw-semibold fs-7'>
            Trades open: {data.trades}
          </span>
        </h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body p-0 d-flex flex-column'>
        {/* begin::Stats */}
        <div className='card-p pt-5 bg-body flex-grow-1'>
          {/* begin::Row */}
          <div className='row g-0'>
            {/* begin::Col */}
            <div className='col mr-8'>
              {/* begin::Label */}
              <div className='fs-7 text-muted fw-semibold'>Average Loss</div>
              {/* end::Label */}

              {/* begin::Stat */}
              <div className='d-flex align-items-center'>
                <div className='fs-4 fw-bold'>{data.averageLoss.formatted}</div>
                <KTIcon
                  iconName={iconType(data.averageLoss).icon}
                  className={`fs-5 ms-1 ${iconType(data.averageLoss).color}`}
                />
              </div>
              {/* end::Stat */}
            </div>
            {/* end::Col */}

            {/* begin::Col */}
            <div className='col'>
              {/* begin::Label */}
              <div className='fs-7 text-muted fw-semibold'>Max Loss</div>
              {/* end::Label */}

              {/* begin::Stat */}
              <div className='fs-4 fw-bold'>{data.maxLoss.formatted}</div>
              {/* end::Stat */}
            </div>
            {/* end::Col */}
          </div>
          {/* end::Row */}

          {/* begin::Row */}
          <div className='row g-0 mt-8'>
            {/* begin::Col */}
            <div className='col'>
              {/* begin::Label */}
              <div className='fs-7 text-muted fw-semibold'>Average Profit</div>
              {/* end::Label */}

              {/* begin::Stat */}
              <div className='d-flex align-items-center'>
                <div className='fs-4 fw-bold'>
                  {data.averageProfit.formatted}
                </div>
                <KTIcon
                  iconName={iconType(data.averageProfit).icon}
                  className={`fs-5 ms-1 ${iconType(data.averageProfit).color}`}
                />
              </div>
              {/* end::Stat */}
            </div>
            {/* end::Col */}

            {/* begin::Col */}
            <div className='col mr-8'>
              {/* begin::Label */}
              <div className='fs-7 text-muted fw-semibold'>Max Profit</div>
              {/* end::Label */}

              {/* begin::Stat */}
              <div className='fs-4 fw-bold'>{data.maxProfit.formatted}</div>
              {/* end::Stat */}
            </div>
            {/* end::Col */}
          </div>
          {/* end::Row */}

          {/* begin::Row */}
          <div className='row g-0 mt-8'>
            {/* begin::Col */}
            <div className='col mr-8'>
              {/* begin::Label */}
              <div className='fs-7 text-muted fw-semibold'>
                Average Return Per Trade
              </div>
              {/* end::Label */}

              {/* begin::Stat */}
              <div className='fs-4 fw-bold'>
                {data.averageReturnPerTrade.formatted}
              </div>
              {/* end::Stat */}
            </div>
            {/* end::Col */}

            {/* begin::Col */}
            <div className='col'>
              {/* begin::Label */}
              <div className='fs-7 text-muted fw-semibold'>Win Rate</div>
              {/* end::Label */}

              {/* begin::Stat */}
              <div className='d-flex align-items-center'>
                <div className='fs-4 fw-bold'>{data.winRate.formatted}</div>
                <KTIcon
                  iconName={iconType(data.winRate).icon}
                  className={`fs-5 ms-1 ${iconType(data.winRate).color}`}
                />
              </div>
              {/* end::Stat */}
            </div>
            {/* end::Col */}
          </div>
          {/* end::Row */}
        </div>
        {/* end::Stats */}
      </div>
      {/* end::Body */}
    </div>
  )
}
