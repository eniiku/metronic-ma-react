import React, { useState } from 'react'
import { fetchAllTradeSummary } from '../../../../services/api'
import { useQuery, useQueryClient } from 'react-query'
import { KTIcon } from '../../../helpers/components/KTIcon'

import '../../../../_metronic/assets/sass/style.react.scss'
import Flatpickr from 'react-flatpickr'

export function DropdownCustomTimeframe() {
  // const queryClient = useQueryClient()

  // const { data: filteredData, isSuccess } = useQuery(
  // 'filteredData',
  // () => fetchAllTradeSummary(filterData),
  // {
  // enabled: false, // Don't automatically fetch on component mount
  // onSuccess: (data: any) => {
  // Update state using the action function when the query is successful
  // action(data)
  // },
  // }
  // )
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // set loading state to let users know that the query is in progress
    // loader(true)

    // trigger the query
    // queryClient.prefetchQuery('filteredData', () =>
    // fetchAllTradeSummary(filterData)
    // )

    // Set Trade Summary data to equal filtered data
    // action(filteredData)

    // check if the query has successfully fetched data
    // if (isSuccess) {
    // console.log('Filtered Data', filteredData)
    // set loading state to false
    // loader(false)
    // }
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
            {[
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
            ].map((item, index) => (
              <div
                key={item.value}
                className={index === 0 ? 'col-12' : 'col-5'}
              >
                <label className='form-check form-check-sm form-check-custom form-check-solid'>
                  <input
                    type='radio'
                    name={item.value}
                    value={item.value}
                    // checked={filterData.equityType === item}
                    // onChange={handleInputChange}
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
            <Flatpickr
              render={({ defaultValue, value, ...props }, ref) => {
                return (
                  <div
                    defaultValue={defaultValue}
                    ref={ref}
                    className='btn btn-sm btn-flex fw-medium gap-2 bg-light-dark py-3 px-6 w-auto btn-active-light-info'
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                  >
                    <span>Start Date</span>
                    <KTIcon
                      iconName='calendar'
                      className='fs-3 text-dark me-1 '
                    />
                  </div>
                )
              }}
            />

            <Flatpickr
              render={({ defaultValue, value, ...props }, ref) => {
                return (
                  <div
                    defaultValue={defaultValue}
                    ref={ref}
                    className='btn btn-sm btn-flex fw-medium gap-2 bg-light-dark py-3 px-6 w-auto btn-active-light-info'
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                  >
                    <span>End Date</span>
                    <KTIcon
                      iconName='calendar'
                      className='fs-3 text-dark me-1 '
                    />
                  </div>
                )
              }}
            />
          </div>
        </div>
        {/* Action Buttons */}

        <div className='d-flex justify-content-end'>
          <button
            type='reset'
            // onClick={resetForm}
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
