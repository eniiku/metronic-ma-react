import React, { useEffect, useState } from 'react'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import { fetchStatistics } from '../../../../services/api'
import { KTIcon } from '../../../helpers/components/KTIcon'
import { getStartEndDate } from '../../../../lib/utils'

interface DropdownCustomTimeframeProps {
  id: string
  setData: React.Dispatch<any>
  setLoader: React.Dispatch<any>
  onTimeframeChange: (timeframe: string) => void
  value: string
  onChange: (value: string) => void
}

const TimeframeOptions = [
  { title: 'All Time', value: 'all_time' },
  { title: 'Today', value: 'today' },
  { title: 'Yesterday', value: 'yesterday' },
  { title: 'This week', value: 'this_week' },
  { title: 'Last week', value: 'last_week' },
  { title: 'This month', value: 'this_month' },
  { title: 'Last month', value: 'last_month' },
  { title: 'This quarter', value: 'this_quarter' },
  { title: 'Last quarter', value: 'last_quarter' },
  { title: 'This year', value: 'this_year' },
  { title: 'Last year', value: 'last_year' },
]

export const DropdownCustomTimeframe = ({
  id,
  setData,
  setLoader,
  onTimeframeChange,
  value,
  onChange,
}: DropdownCustomTimeframeProps) => {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  useEffect(() => {
    const { startDate, endDate } = getStartEndDate(value ? value : 'all_time')
    setStartDate(startDate)
    setEndDate(endDate)
  }, [value])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoader(true)

    try {
      const filteredData = await fetchStatistics(id, startDate, endDate)

      setData(filteredData)
    } catch (error) {
      console.error('Error fetching statistics:', error)
      // Handle error gracefully (e.g., display a user-friendly message)
    } finally {
      setLoader(false)
    }
  }

  const handleReset = () => {
    onChange('all_time')
    setStartDate('')
    setEndDate('')
  }

  return (
    <div
      className='menu menu-sub menu-sub-dropdown w-300px w-md-350px w-lg-400px'
      data-kt-menu='true'
    >
      <form onSubmit={handleSubmit} className='px-7 pb-5'>
        {/* Timeframe Options */}
        <div className='my-10'>
          <label className='form-label fw-bold mb-4'>TimeFrame</label>
          <div className='row align-items-end gap-3 px-0'>
            {TimeframeOptions.map((item, index) => (
              <div
                key={item.value}
                className={index === 0 ? 'col-12' : 'col-5'}
              >
                <label className='form-check form-check-sm form-check-custom form-check-solid'>
                  <input
                    type='radio'
                    name='timeframeOption'
                    value={item.value}
                    checked={value === item.value}
                    onChange={() => {
                      onChange(item.value)
                      onTimeframeChange(item.value)
                    }}
                    className='form-check-input'
                  />
                  <span className='form-check-label'>{item.title}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className='my-10'>
          <label className='form-label fw-bold mb-4'>Select Date Range</label>
          <div className='row justify-content-center gap-5 px-0'>
            {/* Start Date */}
            <Flatpickr
              render={({ defaultValue }, ref) => (
                <div
                  defaultValue={defaultValue}
                  ref={ref}
                  className='btn btn-sm btn-flex fw-medium gap-2 bg-light-dark py-3 px-6 w-auto btn-active-light-info'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                >
                  <span>Start Date</span>
                  <KTIcon iconName='calendar' className='fs-3 text-dark me-1' />
                </div>
              )}
              value={startDate}
              onChange={(dates) =>
                setStartDate(moment(dates[0]).format('YYYY-MM-DD'))
              }
              options={{ dateFormat: 'Y-m-d' }}
            />

            {/* End Date */}
            <Flatpickr
              render={({ defaultValue }, ref) => (
                <div
                  defaultValue={defaultValue}
                  ref={ref}
                  className='btn btn-sm btn-flex fw-medium gap-2 bg-light-dark py-3 px-6 w-auto btn-active-light-info'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                >
                  <span>End Date</span>
                  <KTIcon iconName='calendar' className='fs-3 text-dark me-1' />
                </div>
              )}
              value={endDate}
              onChange={(dates) =>
                setEndDate(moment(dates[0]).format('YYYY-MM-DD'))
              }
              options={{ dateFormat: 'Y-m-d' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='d-flex justify-content-end'>
          <button
            type='reset'
            onClick={handleReset}
            className='btn btn-sm btn-light btn-active-light-primary me-2'
          >
            Reset
          </button>

          <button
            type='submit'
            className='btn btn-sm btn-primary'
            data-kt-menu-dismiss='true'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
