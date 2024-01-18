import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from 'react-bootstrap'
import { KTIcon, KTSVG } from '../../../helpers'
import {
  fetchMarketPrice,
  fetchOptionChainData,
  postTrades,
} from '../../../../services/api'
import { useAuth } from '../../../../app/modules/auth'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import { getOptionChainData, returnPosition } from '../../../../lib/utils'
import { useQuery } from 'react-query'
import { RotatingLines } from 'react-loader-spinner'

type Props = {
  show: boolean
  handleClose: () => void
}

interface FilterData {
  equityType: string
  position: string
  optionType: string
  ticker: string
  price: string
  date: string
  strike: string
  riskType: string[]
  copyTradeUsername: string
}

const modalsRoot = document.getElementById('root-modals') || document.body

export const CustomModal = ({ show, handleClose }: Props) => {
  const { currentUser } = useAuth()
  const tradeTextRef = useRef<HTMLInputElement | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const [filterData, setFilterData] = useState<FilterData>({
    equityType: 'Stock',
    position: 'buy',
    ticker: '',
    optionType: 'call',
    price: 'm',
    // date: moment().format('YYYY-MM-DD'),
    date: '',
    strike: '',
    riskType: [],
    copyTradeUsername: '',
  })

  const [callsData, setCallsData] = useState([])
  const [putsData, setPutsData] = useState([])
  const [dateArray, setDateArray] = useState([])
  const [strikeArray, setStrikeArray] = useState([])
  const [allowOptionChain, setAllowOptionChain] = useState(false)

  const [errors, setErrors] = useState<
    Partial<Record<keyof FilterData, string>>
  >({})

  // const { data: marketPrice } = useQuery('marketPrice', () =>
  //   fetchMarketPrice(filterData.equityType, filterData.ticker)
  // )

  // const { data: optionChainData, isLoading: isOptionChainLoading } = useQuery(
  //   'optionChainData',
  //   () => fetchOptionChainData(filterData.ticker)
  // )

  // Function to handle radio button changes
  const handleRadioChange = (name: keyof FilterData, value: string) => {
    setFilterData((prevData) => ({ ...prevData, [name]: value }))
  }

  // Function to handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilterData((prevData) => ({ ...prevData, [name]: value }))
  }

  // Function to handle checkbox changes
  const handleCheckboxChange = (name: keyof FilterData, value: string) => {
    setFilterData((prevData) => {
      const currentValue = prevData[name]
      const updatedValue =
        typeof currentValue === 'string'
          ? [currentValue, value]
          : currentValue.includes(value)
          ? currentValue.filter((item) => item !== value)
          : [...currentValue, value]

      return {
        ...prevData,
        [name]: updatedValue,
      }
    })
  }

  // Date input change handler
  const handleDateChange = (dates: Date[]) => {
    // Use proper name variable
    setFilterData((prevData) => ({
      ...prevData,
      date: moment(dates[0]).format('YYYY-MM-DD'),
    }))
  }

  // Option type change handler
  const handleOptionTypeChange = (name: keyof FilterData, value: string) => {
    setDateArray([])
    setStrikeArray([])

    setFilterData((prevData) => ({
      ...prevData,
      date: '',
      strike: '',
      price: '',
    }))

    setTimeout(() => {
      if (value === 'call') {
        setFilterData((prevData) => ({
          ...prevData,
          [name]: [...callsData],
        }))
      } else if (value === 'put') {
        setFilterData((prevData) => ({
          ...prevData,
          [name]: [...putsData],
        }))
      }
    }, 1000)

    setFilterData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleCopyClick = async () => {
    if (tradeTextRef.current) {
      try {
        await navigator.clipboard.writeText(tradeTextRef.current.value)
        setCopySuccess(true)

        // Reset the "Copied!" message after a short delay
        setTimeout(() => {
          setCopySuccess(false)
        }, 2000)
      } catch (err) {
        console.error('Unable to copy text: ', err)
      }
    }
  }

  const handleSubmitEnter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const tradePosition = returnPosition(filterData.position)
    const { equityType, ticker, date, strike, optionType, price } = filterData

    const errors: Partial<Record<keyof FilterData, string>> = {}

    if (equityType === 'Stock') {
      if (!tradePosition) {
        errors.position = 'Please choose position'
      }

      if (!ticker) {
        errors.ticker = 'Please enter ticker'
      }

      if (Object.keys(errors).length === 0) {
        const stockMessage = `${tradePosition} ${ticker} @ ${price || 'm'} ${
          filterData.riskType && filterData.riskType.length > 0
            ? '(' + filterData.riskType + ')'
            : ''
        }`

        await postTrades(stockMessage, currentUser ? `${currentUser.id}` : '')
      }
    } else if (equityType === 'Option') {
      if (!tradePosition) {
        errors.position = 'Please enter position'
      }

      if (!ticker) {
        errors.ticker = 'Please enter ticker name'
      }

      // if (!date) {
      //   errors.date = 'Exp date can not be empty'
      // }

      // if (!strike) {
      //   errors.strike = 'Strike price can not be empty'
      // }

      if (!optionType) {
        errors.optionType = 'Please select optionType'
      }

      if (!price) {
        errors.price = 'Please enter contract price'
      }

      if (Object.keys(errors).length === 0) {
        const optionMessage = `${tradePosition} ${ticker} ${strike} ${
          optionType === 'call' ? 'C' : 'P'
        } ${date.split(':')[0]} @ ${price} ${
          filterData.riskType && filterData.riskType.length > 0
            ? '(' + filterData.riskType + ')'
            : ''
        }`

        await postTrades(optionMessage, currentUser ? `${currentUser.id}` : '')
      }
    } else {
      if (!tradePosition) {
        errors.position = 'Please choose position'
      }

      if (!ticker) {
        errors.ticker = 'Please enter ticker'
      }

      if (Object.keys(errors).length === 0) {
        const tradeMessage = `${tradePosition} ${ticker?.toUpperCase()} @ ${
          price ? price : 'm'
        } ${
          filterData.riskType && filterData.riskType.length > 0
            ? '(' + filterData.riskType + ')'
            : ''
        }`

        await postTrades(tradeMessage, currentUser ? `${currentUser.id}` : '')
      }
    }

    setErrors(errors)

    try {
      // Make a POST request using Axios
      await postTrades(message, currentUser ? `${currentUser?.id}` : '')

      // Close the modal
      handleClose()
    } catch (error: any) {
      console.log('error', error)
      console.error('Error submitting data:', error)
      // Show an alert with the API's error message
      alert(`Error: ${error?.response.data.message}`)
    }
  }

  const handleSubmitQuick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate trade description
    !message.trim()
      ? setError('Please fill in a trade description in the proper format')
      : setError('')

    try {
      // Make a POST request using Axios
      await postTrades(message, currentUser ? `${currentUser?.id}` : '')

      // Close the modal
      handleClose()
    } catch (error: any) {
      console.error('Error submitting data:', error)

      if (
        error?.response &&
        error?.response?.data &&
        error?.response?.data?.message
      ) {
        // Display the error message from the API response
        setError(error?.response?.data?.message)
      } else {
        // Display a generic error message
        setError('Error submitting data. Please try again.')
      }
    }
  }

  const handleReset = () => {
    setFilterData({
      equityType: 'Stock',
      position: 'buy',
      ticker: '',
      price: 'm',
      date: '',
      strike: '',
      optionType: 'call',
      riskType: [],
      copyTradeUsername: '',
    })
  }

  const [marketPrice, setMarketPrice] = useState<any>({})
  const [optionChainData, setOptionChainData] = useState<any>({})
  const [isOptionChainLoading, setIsOptionChainLoading] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<number>(null)

  useEffect(() => {
    setAllowOptionChain(false)

    const timer = setTimeout(async () => {
      if (filterData.equityType !== 'Option') {
        setIsOptionChainLoading(true)
        const market = await fetchMarketPrice(
          filterData.equityType,
          filterData.ticker
        )
        setMarketPrice(market)
        setIsOptionChainLoading(false)

        console.log('market', market)
      } else if (filterData.ticker !== '' && filterData.ticker.length > 2) {
        setIsOptionChainLoading(true)
        const option = await fetchOptionChainData(filterData.ticker)
        setOptionChainData(option)

        setIsOptionChainLoading(false)
        setAllowOptionChain(true)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [filterData.ticker])

  const [isOptionContract, setIsOptionContract] = useState(false)

  const toggleOptionContract = () => setIsOptionContract((prev) => !prev)

  useEffect(() => {
    if (marketPrice && filterData.ticker !== '') {
      // Update the price state based on real market price
      if (filterData.equityType !== 'Option') {
        const price = marketPrice?.data?.regularMarketPrice
        setFilterData((prevData) => ({
          ...prevData,
          price: `${price}`,
        }))
      }
    }

    // Fetch and set option chain data when the relevant state changes
    const callOptionChainData = async () => {
      const optionChain = await getOptionChainData(optionChainData?.data)

      setCallsData(optionChain.optionCallData)
      setPutsData(optionChain.optionPutData)
      setDateArray(optionChain.optionData)
      setAllowOptionChain(true)
    }

    if (optionChainData) callOptionChainData()
  }, [marketPrice, optionChainData])

  return createPortal(
    <Modal
      id='kt_modal_create_app'
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered mw-500px'
      show={show}
      onHide={handleClose}
      backdrop={true}
    >
      <div className='modal-header'>
        <h2>My Trade</h2>
        {/* begin::Close */}
        <div
          className='btn btn-sm btn-icon btn-active-color-primary'
          onClick={handleClose}
        >
          <KTIcon className='fs-1' iconName='cross' />
        </div>
        {/* end::Close */}
      </div>

      <div className='modal-body '>
        <ul className='nav nav-tabs nav-pills mb-5 fs-4 border-0 row align-item-center justify-content-center'>
          <li className='nav-item col-5'>
            <a
              className='nav-link active text-center'
              data-bs-toggle='tab'
              href='#kt_tab_pane_1'
            >
              Enter trade
            </a>
          </li>

          <li className='nav-item col-5'>
            <a
              className='nav-link text-center'
              data-bs-toggle='tab'
              href='#kt_tab_pane_2'
            >
              Quick Type
            </a>
          </li>
        </ul>

        <div className='tab-content' id='myTabContent'>
          {/* Enter Trade tab */}
          <div
            className='tab-pane fade active show'
            id='kt_tab_pane_1'
            role='tabpanel'
          >
            {isOptionContract ? (
              <div className='min-h-400px'>
                <button
                  onClick={toggleOptionContract}
                  className='btn btn-link  btn-active-color-primary'
                >
                  &lt; Back
                </button>

                <div className='accordion' id='kt_accordion_1'>
                  {dateArray?.map((item: any, index: number) => {
                    const no = index + 1

                    const currentPrice = optionChainData?.data.underlyingPrice

                    const renderMiddleLine = (x: any) => {
                      if (currentPrice > x.strike_price) {
                        return null
                      } else {
                        return (
                          <div className='w-100 separator border-dashed border-2 border-success' />
                        )
                      }
                    }

                    const onSelectOptionContract = (contractData: any) => {
                      console.log({ contractData })

                      setFilterData((prevData) => ({
                        ...prevData,
                        price: contractData.price + '',
                        strike: contractData.strike + '',
                        date: contractData.expDate,
                        optionType: contractData.type,
                      }))

                      if (contractData.mType == 'bid') {
                        //sell
                        setFilterData((prev) => ({ ...prev, position: 'sell' }))
                      } else {
                        //buy
                        setFilterData((prev) => ({ ...prev, position: 'buy' }))
                      }
                    }

                    const onContractSelect = (
                      type: string,
                      data: any,
                      expDate: string
                    ) => {
                      const date = moment(expDate.split(':')[0]).format(
                        'YYYY-MM-DD'
                      )
                      const obj = {
                        expDate: date,
                        strike: data.strikePrice,
                        price: data.mark,
                        type: type,
                      }
                      onSelectOptionContract(obj)
                      toggleOptionContract()
                    }
                    const handleToggle = (no: number) => {
                      if (openAccordion === no) {
                        setOpenAccordion(null)
                      } else {
                        setOpenAccordion(no)
                      }
                    }

                    return (
                      <div className='accordion-item' key={no}>
                        <h2
                          className='accordion-header'
                          id={`kt_accordion_${no}_header_${no}`}
                        >
                          <button
                            className='accordion-button fs-6 fw-bold collapsed'
                            type='button'
                            onClick={() => handleToggle(no)}
                            data-toggle='collapse'
                            data-target={`#kt_accordion_${no}_body_${no}`}
                            aria-expanded={openAccordion === no}
                            aria-controls={`#kt_accordion_${no}_body_${no}`}
                          >
                            {item?.date
                              ? moment(item?.date.split(':')[0]).format(
                                  'DD MMM YYYY'
                                )
                              : ''}{' '}
                            ({item?.date.split(':')[1]} Days to expire)
                          </button>
                        </h2>
                        {openAccordion === no && (
                          <div
                            id={`kt_accordion_${no}_body_${no}`}
                            className='accordion-collapse'
                            aria-labelledby={`kt_accordion_${no}_header_${no}`}
                            data-parent='#kt_accordion_1'
                          >
                            <div className='accordion-body'>
                              <div className='w-100 d-flex align-items-center justify-content-around pe-6 pb-4'>
                                <div className='fs-2 fw-bold'>CALLS</div>

                                <div>
                                  <KTIcon
                                    className='fs-1 text-info'
                                    iconName='setting-2'
                                  />
                                </div>

                                <div className='fs-2 fw-bold'>PUT</div>
                              </div>

                              <div>
                                {item?.strike_data
                                  .slice(0, 5)
                                  .map((x: any, i: any) => {
                                    const isDivider =
                                      Math.trunc(currentPrice).toString() +
                                        '.0' ===
                                        x.strike_price ||
                                      (currentPrice < x.strike_price &&
                                        currentPrice > x.strike_price)
                                    return (
                                      <>
                                        <div className='d-flex text-center justify-content-around align-items-center'>
                                          <div className='col-5 d-flex justify-content-between bg-light-primary'>
                                            <button
                                              onClick={() =>
                                                onContractSelect(
                                                  'bid',
                                                  x.callData,
                                                  item?.date
                                                )
                                              }
                                              className='fs-6 fw-semibold w-100 btn btn-link '
                                            >
                                              {x?.callData?.bid}
                                            </button>
                                            <button
                                              onClick={() =>
                                                onContractSelect(
                                                  'ask',
                                                  x.callData,
                                                  item?.date
                                                )
                                              }
                                              className='fs-6 fw-semibold w-100 btn btn-link'
                                            >
                                              {x?.callData?.ask}
                                            </button>
                                            <button
                                              onClick={() =>
                                                onContractSelect(
                                                  'mark',
                                                  x.callData,
                                                  item?.date
                                                )
                                              }
                                              className='fs-6 fw-semibold w-100 btn btn-link '
                                            >
                                              {x?.callData?.mark}
                                            </button>
                                          </div>

                                          <div className='bg-muted col-2'>
                                            <text className='fs-5 fw-bold btn btn-link btn-color-muted'>
                                              {x?.strike_price}
                                            </text>
                                          </div>

                                          <div className='d-flex  justify-content-around bg-light-primary col-5'>
                                            <button
                                              onClick={() =>
                                                onContractSelect(
                                                  'bid',
                                                  x.putData,
                                                  item?.date
                                                )
                                              }
                                              className='fs-6 fw-semibold btn btn-link '
                                            >
                                              {x?.putData.bid}
                                            </button>
                                            <button
                                              onClick={() =>
                                                onContractSelect(
                                                  'ask',
                                                  x.putData,
                                                  item?.date
                                                )
                                              }
                                              className='fs-6 fw-semibold btn btn-link '
                                            >
                                              {x?.putData.ask}
                                            </button>
                                            <button
                                              onClick={() =>
                                                onContractSelect(
                                                  'mark',
                                                  x.putData,
                                                  item?.date
                                                )
                                              }
                                              className='fs-6 fw-semibold btn btn-link'
                                            >
                                              {x?.putData.mark}
                                            </button>
                                          </div>
                                        </div>
                                        {isDivider && (
                                          <div className='w-100 separator border-dashed border-2 border-success' />
                                        )}
                                        {renderMiddleLine(x)}
                                      </>
                                    )
                                  })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnter} className='px-7 py-5'>
                {/* Asset */}
                <div className='mb-6'>
                  <label className='form-label fw-bold'>Equity Type</label>

                  <div className='d-flex flex-wrap align-items-center gap-4'>
                    {['Stock', 'Option', 'Forex', 'Crypto'].map((item) => (
                      <label
                        key={item}
                        className='form-check form-check-sm form-check-custom form-check-solid me-5'
                      >
                        <input
                          type='radio'
                          name='equityType'
                          value={item}
                          checked={filterData.equityType === item}
                          onChange={() => handleRadioChange('equityType', item)}
                          className='form-check-input'
                        />
                        <span className='form-check-label'>{item}</span>
                      </label>
                    ))}
                  </div>

                  {errors.equityType && (
                    <div className='text-danger mt-2'>{errors.equityType}</div>
                  )}
                </div>

                {/* Position */}
                <div className='mb-6'>
                  <label className='form-label fw-bold'>Position</label>

                  <div className='d-flex flex-wrap align-items-center gap-4'>
                    {['buy', 'sell', 'short', 'cover'].map((item) => (
                      <label
                        key={item}
                        className='form-check form-check-sm form-check-custom form-check-solid me-5'
                      >
                        <input
                          type='radio'
                          name='position'
                          value={item}
                          checked={filterData.position === item}
                          onChange={() => handleRadioChange('position', item)}
                          className='form-check-input'
                        />
                        <span className='form-check-label text-capitalize'>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>

                  {errors.position && (
                    <div className='text-danger mt-2'>{errors.position}</div>
                  )}
                </div>

                {/* Ticker & Option & Price */}

                <div className='mb-6 row gap-2'>
                  <div className='col-5'>
                    <div className='d-flex align-items-center'>
                      <label className='d-flex align-items-center form-label fw-bold mb-2 me-2'>
                        <span>Ticker</span>
                      </label>

                      {isOptionChainLoading && <Loader />}
                    </div>

                    <input
                      type='text'
                      className='form-control form-control-sm form-control-solid border-gray-400'
                      name='ticker'
                      value={filterData.ticker.toLocaleUpperCase()}
                      onChange={handleInputChange}
                      placeholder='E.g, AAPL'
                    />

                    {errors.ticker && (
                      <div className='text-danger mt-2'>{errors.ticker}</div>
                    )}
                  </div>

                  {filterData.equityType === 'Option' ? (
                    <div className='col-5'>
                      <label className='d-flex align-items-center form-label fw-bold mb-4'>
                        <span>Option Type</span>
                      </label>

                      <div className='d-flex flex-wrap align-items-center gap-4'>
                        {['call', 'put'].map((item) => (
                          <label
                            key={item}
                            className='form-check form-check-sm form-check-custom form-check-solid me-5'
                          >
                            <input
                              type='radio'
                              name='optionType'
                              value={item}
                              checked={filterData.optionType === item}
                              onChange={() =>
                                handleOptionTypeChange('optionType', item)
                              }
                              readOnly
                              disabled
                              className='form-check-input'
                            />
                            <span className='form-check-label text-capitalize'>
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className='col-5'>
                      <div className='d-flex align-items-center'>
                        <label className='d-flex align-items-center form-label fw-bold mb-2 me-2'>
                          <span>Price</span>
                        </label>

                        {isOptionChainLoading && <Loader />}
                      </div>

                      <div className='d-flex align-items-center gap-2'>
                        <span>$</span>

                        <input
                          type='number'
                          className='form-control form-control-sm form-control-solid border-gray-400'
                          name='price'
                          value={filterData.price}
                          onChange={handleInputChange}
                          readOnly
                          disabled
                        />
                      </div>
                      {errors.price && (
                        <div className='text-danger mt-2'>{errors.price}</div>
                      )}
                    </div>
                  )}
                </div>

                {filterData.equityType === 'Option' && (
                  <div className='mb-6'>
                    <button
                      type='button'
                      className='btn btn-sm btn-info w-100'
                      onClick={toggleOptionContract}
                      disabled={Object.keys(optionChainData).length === 0}
                    >
                      Select Option contract
                    </button>

                    {errors.optionType && (
                      <div className='text-danger mt-2'>
                        {errors.optionType}
                      </div>
                    )}
                  </div>
                )}

                {/* Date & Strike*/}

                {filterData.equityType === 'Option' && (
                  <div className='mb-6 row gap-2'>
                    <div className='col-5'>
                      <div className='d-flex align-items-center'>
                        <label className='d-flex align-items-center form-label fw-bold mb-2 me-2'>
                          <span>Date</span>
                        </label>

                        {isOptionChainLoading && <Loader />}
                      </div>

                      <Flatpickr
                        render={({ defaultValue }, ref) => (
                          <div
                            defaultValue={defaultValue}
                            ref={ref}
                            className='btn btn-sm btn-flex fw-medium gap-2 bg-light-dark py-3 px-6 btn-active-light-info w-100'
                            data-kt-menu-trigger='click'
                            data-kt-menu-placement='bottom-end'
                          >
                            <KTIcon
                              iconName='calendar'
                              className='fs-3 text-dark me-1'
                            />
                            <span>{filterData.date}</span>
                          </div>
                        )}
                        name='date'
                        value={filterData.date}
                        onChange={handleDateChange}
                        readOnly
                        disabled
                      />
                      {errors.date && (
                        <div className='text-danger mt-2'>{errors.date}</div>
                      )}
                    </div>

                    <div className='col-5'>
                      <div className='d-flex align-items-center '>
                        <label className='d-flex align-items-center form-label fw-bold mb-2 me-2'>
                          <span>Strike</span>
                        </label>

                        {isOptionChainLoading && <Loader />}
                      </div>

                      <div className='d-flex align-items-center gap-2'>
                        <input
                          type='number'
                          className='form-control form-control-sm form-control-solid border-gray-400'
                          name='strike'
                          value={filterData.strike}
                          onChange={handleInputChange}
                          readOnly
                          disabled
                        />
                      </div>
                      {errors.strike && (
                        <div className='text-danger mt-2'>{errors.strike}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className='mb-6 row gap-2'>
                  {filterData.equityType === 'Option' && (
                    <div className='col-5'>
                      <div className='d-flex align-items-center'>
                        <label className='d-flex align-items-center form-label fw-bold mb-2 me-2'>
                          <span>Price</span>
                        </label>

                        {isOptionChainLoading && <Loader />}
                      </div>

                      <div className='d-flex align-items-center gap-2'>
                        <span>$</span>

                        <input
                          type='number'
                          className='form-control form-control-sm form-control-solid border-gray-400'
                          name='price'
                          value={filterData.price}
                          onChange={handleInputChange}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Risk Type  */}
                <div className='mb-6'>
                  <div className='d-flex flex-wrap align-items-center gap-4'>
                    {[
                      { title: 'Risky', value: 'risky' },
                      { title: 'Swing', value: 'swing' },
                      { title: 'Day Trade', value: 'daytrade' },
                      { title: 'Hedge', value: 'hedge' },
                    ].map((item) => (
                      <label
                        key={item.value}
                        className='form-check form-check-sm form-check-custom form-check-solid me-5'
                      >
                        <input
                          type='checkbox'
                          name='riskType'
                          value={item.value}
                          checked={filterData.riskType.includes(item.value)}
                          onChange={() =>
                            handleCheckboxChange('riskType', item.value)
                          }
                          className='form-check-input'
                        />
                        <span className='form-check-label text-capitalize'>
                          {item.title}
                        </span>

                        {errors.riskType &&
                          errors.riskType.includes(item.value) && (
                            <div className='text-danger mt-2'>{`Please select ${item.title}`}</div>
                          )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Copy Trade */}
                <div className='px-3 rounded bg-light-dark fw-bold w-100 mb-6 d-flex align-items-center justify-content-between border border-gray-200'>
                  <span className='me-4 w-100 text-start text-gray-700'>
                    <input
                      ref={tradeTextRef}
                      type='text'
                      readOnly
                      className='form-control-plaintext'
                      value={
                        filterData.equityType === 'Option'
                          ? `${returnPosition(
                              filterData.position
                            )} ${filterData.ticker.toLocaleUpperCase()} ${
                              filterData.strike
                            } ${filterData.optionType === 'call' ? 'C' : 'P'} ${
                              filterData.date.split(':')[0]
                                ? moment(filterData.date.split(':')[0]).format(
                                    'MM/DD/YYYY'
                                  )
                                : ''
                            } @ ${filterData.price} ${
                              filterData.riskType &&
                              filterData.riskType.length > 0
                                ? '(' + filterData.riskType + ')'
                                : ''
                            }`
                          : `${returnPosition(
                              filterData.position
                            )} ${filterData.ticker.toLocaleUpperCase()} @ ${
                              filterData.price ? filterData.price : 'm'
                            } ${
                              filterData.riskType &&
                              filterData.riskType.length > 0
                                ? '(' + filterData.riskType + ')'
                                : ''
                            }`
                      }
                    />
                  </span>

                  <button
                    className='btn btn-sm fs-8 px-3 py-1 btn-secondary'
                    type='button'
                    onClick={handleCopyClick}
                  >
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
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
                    Share Trade Idea
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Trade tab */}
          <div className='tab-pane fade' id='kt_tab_pane_2' role='tabpanel'>
            {/*begin::Form */}
            <form onSubmit={handleSubmitQuick} id='kt_modal_create_app_form'>
              <div className='fv-row mb-6'>
                <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
                  <span className='required'>Trade Description</span>
                  <i
                    className='fas fa-exclamation-circle ms-2 fs-7'
                    data-bs-toggle='tooltip'
                    title='Quick type trade description'
                  ></i>
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  name='trade_desc'
                  placeholder='BTO AAPL 6/29 140c @$1.5'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {/* Risk Type  */}
                <div className='my-10'>
                  <div className='d-flex flex-wrap align-items-center gap-4'>
                    {[
                      { title: 'Risky', value: 'risky' },
                      { title: 'Swing', value: 'swing' },
                      { title: 'Day Trade', value: 'daytrade' },
                      { title: 'Hedge', value: 'hedge' },
                    ].map((item) => (
                      <label
                        key={item.value}
                        className='form-check form-check-sm form-check-custom form-check-solid me-5'
                      >
                        <input
                          type='checkbox'
                          name='riskType'
                          value={item.value}
                          checked={filterData.riskType.includes(item.value)}
                          onChange={() =>
                            handleCheckboxChange('riskType', item.value)
                          }
                          className='form-check-input'
                        />
                        <span className='form-check-label text-capitalize'>
                          {item.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {error ? (
                  <div className='fv-plugins-message-container'>
                    <div
                      data-field='trade_description'
                      data-validator='notEmpty'
                      className='fv-help-block'
                    >
                      {error ||
                        'Please fill in a trade description in the proper format'}
                    </div>
                  </div>
                ) : null}
              </div>
              {/* Submit Button */}

              <button
                type='submit'
                className='btn btn-lg btn-primary'
                disabled={!message.trim()}
              >
                Share Trade Idea
              </button>
            </form>
            {/*end::Form */}
          </div>
        </div>
      </div>
    </Modal>,
    modalsRoot
  )
}

const Loader = () => (
  <RotatingLines
    visible={true}
    width='15'
    strokeColor='gray'
    strokeWidth='3'
    animationDuration='0.75'
    ariaLabel='rotating-lines-loading'
  />
)
