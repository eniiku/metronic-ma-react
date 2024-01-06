import React, { useState } from 'react'
import { fetchAllTradeSummary } from '../../../../services/api'
import { useQuery, useQueryClient } from 'react-query'
import { set } from 'lodash'

type FilterData = {
  ticker: string
  equityType: string
  transactionType: string[]
  allOrOpenOrClose: string[]
  allOrDayOrWeek: string
  dayWeekLength: string
  orderBy: string
  orderType: string
  riskType: string[]
}

export function DropdownCustom({
  action,
  loader,
}: {
  action: React.Dispatch<any>
  loader: React.Dispatch<any>
}) {
  // id: undefined,
  // isOpen: undefined,
  // positionNumber: undefined,
  // tradeDirection: undefined,
  // daysOpen: undefined,
  // createdDate: undefined,
  // updatedDate: undefined,
  // closeDate: undefined,

  const [filterData, setFilterData] = useState<FilterData>({
    ticker: '',
    equityType: '',
    transactionType: [],
    allOrOpenOrClose: [],
    allOrDayOrWeek: 'day',
    dayWeekLength: '30',
    orderBy: '',
    orderType: '',
    riskType: [],
  })

  const queryClient = useQueryClient()

  const { data: filteredData, isSuccess } = useQuery(
    'filteredData',
    () => fetchAllTradeSummary(filterData),
    {
      enabled: false, // Don't automatically fetch on component mount
      onSuccess: (data: any) => {
        // Update state using the action function when the query is successful
        action(data)
      },
    }
  )

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFilterData((prevData: any) => ({ ...prevData, [name]: value }))
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFilterData((prevData: any) => {
      const isChecked = prevData[name].includes(value)
      const updatedArray = isChecked
        ? prevData[name].filter((item: any) => item !== value)
        : [...prevData[name], value]
      return { ...prevData, [name]: updatedArray }
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // set loading state to let users know that the query is in progress
    loader(true)

    // trigger the query
    queryClient.prefetchQuery('filteredData', () =>
      fetchAllTradeSummary(filterData)
    )

    // Set Trade Summary data to equal filtered data
    action(filteredData)

    // check if the query has successfully fetched data
    if (isSuccess) {
      console.log('Filtered Data', filteredData)
      // set loading state to false
      loader(false)
    }
  }

  const resetForm = () => {
    setFilterData({
      ticker: '',
      equityType: '',
      transactionType: [],
      allOrOpenOrClose: [],
      allOrDayOrWeek: '',
      dayWeekLength: '',
      orderBy: '',
      orderType: '',
      riskType: [],
    })

    // set loading state to let users know that the query is in progress
    loader(true)

    // trigger the query
    queryClient.prefetchQuery('filteredData', () => fetchAllTradeSummary())

    // check if the query has successfully fetched data
    if (isSuccess) {
      console.log('Filtered Data', filteredData)

      // set loading state to false
      loader(false)
    }
  }
  return (
    <div
      className='menu menu-sub menu-sub-dropdown w-300px w-md-350px w-lg-400px'
      data-kt-menu='true'
    >
      <div className='px-7 py-5'>
        <div className='fs-5 text-gray-900 fw-bolder'>Trade Filter</div>
      </div>

      <div className='separator border-gray-200'></div>

      <form onSubmit={handleSubmit} className='px-7 py-5'>
        {/* Ticker */}
        <div className='mb-10'>
          <input
            type='text'
            className='form-control form-control-sm form-control-solid border-gray-500'
            name='ticker'
            placeholder='Ticker'
            value={filterData.ticker}
            onChange={handleInputChange}
          />
        </div>

        {/* Equity Type  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Equity Type</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {['All', 'Stock', 'Option', 'Forex', 'Crypto'].map((item) => (
              <label
                key={item}
                className='form-check form-check-sm form-check-custom form-check-solid me-5'
              >
                <input
                  type='radio'
                  name='equityType'
                  value={item}
                  checked={filterData.equityType === item}
                  onChange={handleInputChange}
                  className='form-check-input'
                />
                <span className='form-check-label'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Transaction Type & Position */}
        <div className='mb-10 d-flex gap-5'>
          <div>
            <label className='form-label fw-bold'>Transaction Type</label>

            <div className='d-flex flex-wrap gap-4'>
              {['credit', 'debit'].map((item) => (
                <label
                  key={item}
                  className='form-check form-check-sm form-check-custom form-check-solid me-5'
                >
                  <input
                    type='checkbox'
                    name='transactionType'
                    value={item}
                    checked={filterData.transactionType.includes(item)}
                    onChange={handleCheckboxChange}
                    className='form-check-input'
                  />
                  <span className='form-check-label text-capitalize'>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className='form-label fw-bold'>Option</label>

            <div className='d-flex flex-wrap gap-4'>
              {['open', 'closed'].map((item) => (
                <label
                  key={item}
                  className='form-check form-check-sm form-check-custom form-check-solid me-5'
                >
                  <input
                    type='checkbox'
                    name='allOrOpenOrClose'
                    value={item}
                    checked={filterData.allOrOpenOrClose.includes(item)}
                    onChange={handleCheckboxChange}
                    className='form-check-input'
                  />
                  <span className='form-check-label text-capitalize'>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Days & Weeks */}

        <div className='row mb-10'>
          {['day', 'weeks'].map((item) => (
            <div
              key={item}
              className='d-flex flex-wrap align-items-center gap-4 col-6'
            >
              <label className='form-check form-check-sm form-check-custom form-check-solid me-1'>
                <input
                  type='radio'
                  name='allOrDayOrWeek'
                  value={item}
                  checked={filterData.allOrDayOrWeek === item}
                  onChange={handleInputChange}
                  className='form-check-input'
                />
                <span className='form-check-label fw-bold text-capitalize fs-6'>
                  {item}
                </span>
              </label>
              {filterData.allOrDayOrWeek === item && (
                <input
                  type='number'
                  className='form-control form-control-sm form-control-solid border-gray-500 mw-40px me-5'
                  name='dayWeekLength'
                  placeholder={item === 'day' ? '30' : '4'}
                  min={item === 'days' ? 1 : 1}
                  max={item === 'days' ? 30 : 52}
                  value={filterData.dayWeekLength + ''}
                  onChange={handleInputChange}
                />
              )}
            </div>
          ))}
        </div>

        {/* Order By  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Order By</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {[
              'profit or loss%',
              'closed date',
              'crafted date',
              'last updated',
            ].map((item) => (
              <label
                key={item}
                className='form-check form-check-sm form-check-custom form-check-solid me-5'
              >
                <input
                  type='radio'
                  name='orderBy'
                  value={item}
                  checked={filterData.orderBy === item}
                  onChange={handleInputChange}
                  className='form-check-input'
                />
                <span className='form-check-label text-capitalize'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort Order Type  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Sort Order</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {['ascending order', 'descending order'].map((item) => (
              <label
                key={item}
                className='form-check form-check-sm form-check-custom form-check-solid me-5'
              >
                <input
                  type='radio'
                  name='orderType'
                  value={item}
                  checked={filterData.orderType === item}
                  onChange={handleInputChange}
                  className='form-check-input'
                />
                <span className='form-check-label text-capitalize'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Risk Type  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Risk Type</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {['standard', 'risky', 'swing', 'day trade'].map((item) => (
              <label
                key={item}
                className='form-check form-check-sm form-check-custom form-check-solid me-5'
              >
                <input
                  type='checkbox'
                  name='riskType'
                  value={item}
                  checked={filterData.riskType.includes(item)}
                  onChange={handleCheckboxChange}
                  className='form-check-input'
                />
                <span className='form-check-label text-capitalize'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* User Filter */}
        {/* <div className='mb-10'>
          <label className='d-flex align-items-center form-label fw-bold mb-2'>
            <span>User Filter</span>
            <i
              className='fas fa-exclamation-circle ms-2 fs-7'
              data-bs-toggle='tooltip'
              title='Specify the user name you want to filter'
            ></i>
          </label>
          <input
            type='text'
            className='form-control form-control-sm form-control-solid border-gray-500'
            name='user'
            // value={filterData.ticker}
            onChange={handleInputChange}
            placeholder='Ex:DesiArtist'
          />
        </div> */}

        {/* Action Buttons */}

        <div className='d-flex justify-content-end'>
          <button
            type='reset'
            onClick={resetForm}
            className='btn btn-sm btn-light btn-active-light-primary me-2'
          >
            Reset
          </button>

          <button
            type='submit'
            className='btn btn-sm btn-primary'
            data-kt-menu-dismiss='true'
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  )
}
