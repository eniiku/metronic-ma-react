import { useState } from 'react'
import { fetchAllTradeSummary } from '../../../../services/api'
import { useQuery, useQueryClient } from 'react-query'

type FilterData = {
  ticker: string
  equityType: string
  transactionType: string[]
  allOrOpenOrClose: string[]
  daysOpen: string
  orderBy: string
  orderType: string
  riskType: string[]
}

export function DropdownCustom() {
  // platform: undefined,
  // command: undefined,
  // allOrOpenOrClose: undefined,
  // allOrDayOrWeek: undefined,
  // dayWeekLength: undefined,
  // id: undefined,
  // isOpen: undefined,
  // transactionType: undefined,
  // positionNumber: undefined,
  // ticker: undefined,
  // tradeDirection: undefined,
  // riskType: undefined,
  // equityType: undefined,
  // daysOpen: undefined,
  // orderBy: undefined,
  // orderType: undefined,
  // createdDate: undefined,
  // updatedDate: undefined,
  // closeDate: undefined,
  // page: '1',
  // limit: '10'

  const [filterData, setFilterData] = useState<FilterData>({
    ticker: '',
    equityType: '',
    transactionType: [],
    allOrOpenOrClose: [],
    daysOpen: '',
    orderBy: '',
    orderType: '',
    riskType: [],
  })

  // const { data, isLoading, isError } = useQuery(
  //   ['filteredData', filterData],
  //   (key) => fetchData(key, filterData)
  // )

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

  const queryClient = useQueryClient()

  const refetchData = () => {
    queryClient.invalidateQueries('summary')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    console.log('Filter Data', filterData)

    refetchData()
  }

  const resetForm = () => {
    setFilterData({
      ticker: '',
      equityType: '',
      transactionType: [],
      allOrOpenOrClose: [],
      daysOpen: '',
      orderBy: '',
      orderType: '',
      riskType: [],
    })
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
              {['Credit', 'Debit'].map((item) => (
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
                  <span className='form-check-label'>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className='form-label fw-bold'>Option</label>

            <div className='d-flex flex-wrap gap-4'>
              {['Open', 'Closed'].map((item) => (
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
                  <span className='form-check-label'>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order By  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Order By</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {[
              'Profit Or Loss%',
              'Closed Date',
              'Crafted Date',
              'Last Updated',
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
                <span className='form-check-label'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort Order Type  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Sort Order</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {['Ascending Order', 'Descending Order'].map((item) => (
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
                <span className='form-check-label'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Risk Type  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Risk Type</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {['Standard', 'Risky', 'Swing', 'Day Trade'].map((item) => (
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
                <span className='form-check-label'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* User Filter */}
        <div className='mb-10'>
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
        </div>

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
            // data-kt-menu-dismiss='true'
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  )
}
