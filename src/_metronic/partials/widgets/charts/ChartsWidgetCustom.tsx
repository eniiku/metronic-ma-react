import { useEffect, useRef, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '../../../assets/ts/_utils'
import { useThemeMode } from '../../layout/theme-mode/ThemeModeProvider'
import { Loading } from '../../../../app/components/Loading'
import NoData from '../../../../app/components/NoData'

type Props = {
  className: string
  title: string
  seriesData: { name: string; data: number[] }[]
  isLoading: boolean
  isError: boolean
}

const ChartsWidgetCustom: FC<Props> = ({
  className,
  seriesData,
  title,
  isLoading,
  isError,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(
      chartRef.current,
      getChartOptions(height, seriesData)
    )
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3'>{title}</span>
        </h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <NoData type='error' message='Error fetching chart data' />
      ) : (
        <div className='card-body py-0'>
          {/* begin::Chart */}
          <div
            ref={chartRef}
            id='kt_charts_widget_5_chart'
            style={{ height: '180px' }}
          ></div>
          {/* end::Chart */}
        </div>
      )}
      {/* end::Body */}
    </div>
  )
}

export { ChartsWidgetCustom }

function getChartOptions(
  height: number,
  seriesData: { name: string; data: number[] }[]
): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const labelColorAlt = getCSSVariableValue('--bs-gray-900')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  const baseColor = getCSSVariableValue('--bs-primary')
  const secondaryColor = getCSSVariableValue('--bs-info')
  const baseWarningColor = getCSSVariableValue('--bs-warning')
  const baseDangerColor = getCSSVariableValue('--bs-danger')

  return {
    series: seriesData,
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      stacked: true,
      stackType: '100%',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '12%',
        borderRadius: 12,
      },
    },
    legend: {
      show: true,
      fontWeight: 500,
      labels: {
        colors: labelColorAlt,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [''],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: -80,
      max: 80,
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return val + '%'
        },
      },
    },
    colors: [baseColor, baseDangerColor, baseWarningColor, secondaryColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}
