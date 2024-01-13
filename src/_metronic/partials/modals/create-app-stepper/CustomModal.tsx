import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from 'react-bootstrap'
import { KTIcon } from '../../../helpers'
import { postTrades } from '../../../../services/api'
import { useAuth } from '../../../../app/modules/auth'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import { returnPosition } from '../../../../lib/utils'

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

  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const [filterData, setFilterData] = useState<FilterData>({
    equityType: 'Stock',
    position: 'buy',
    ticker: '',
    optionType: 'call',
    price: 'm',
    date: '',
    strike: '',
    riskType: [],
    copyTradeUsername: '',
  })

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      equityType: '',
      position: '',
      ticker: '',
      price: '',
      date: '',
      strike: '',
      optionType: 'call',
      riskType: [],
      copyTradeUsername: '',
    })
  }

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
          {/* 1st tab */}
          <div
            className='tab-pane fade active show'
            id='kt_tab_pane_1'
            role='tabpanel'
          >
            <form onSubmit={handleSubmit} className='px-7 py-5'>
              {/* Asset */}
              <div className='mb-10'>
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
              </div>

              {/* Position */}
              <div className='mb-10'>
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
              </div>

              {/* Ticker & Option & Price */}

              <div className='mb-10 row gap-2'>
                <div className='col-5'>
                  <label className='d-flex align-items-center form-label fw-bold mb-2'>
                    <span>Ticker</span>
                  </label>

                  <input
                    type='text'
                    className='form-control form-control-sm form-control-solid border-gray-400'
                    name='ticker'
                    value={filterData.ticker}
                    onChange={handleInputChange}
                    placeholder='E.g, AAPL'
                  />
                </div>

                {filterData.equityType === 'Option' ? (
                  <div className='col-5'>
                    <label className='d-flex align-items-center form-label fw-bold mb-2'>
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
                            name='position'
                            value={item}
                            checked={filterData.position === item}
                            onChange={() =>
                              handleRadioChange('optionType', item)
                            }
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
                    <label className='d-flex align-items-center form-label fw-bold mb-2'>
                      <span>Price</span>
                    </label>

                    <div className='d-flex align-items-center gap-2'>
                      <span>$</span>

                      <input
                        type='text'
                        className='form-control form-control-sm form-control-solid border-gray-400'
                        name='price'
                        value={filterData.price}
                        onChange={handleInputChange}
                        placeholder='1.30'
                      />
                    </div>
                  </div>
                )}
              </div>

              {filterData.equityType === 'Option' && (
                <div className='mb-10'>
                  <button className='btn btn-sm btn-info w-100'>
                    Select Option contract
                  </button>
                </div>
              )}

              {/* Date & Strike*/}

              <div className='mb-10 row gap-2'>
                <div className='col-5'>
                  <label className='d-flex align-items-center form-label fw-bold mb-2'>
                    <span>Date</span>
                  </label>

                  <Flatpickr
                    render={({ defaultValue }, ref) => (
                      <div
                        defaultValue={defaultValue}
                        ref={ref}
                        className='btn btn-sm btn-flex fw-medium gap-2 bg-light-dark py-3 px-6 w-auto btn-active-light-info'
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
                    onChange={(dates) =>
                      setFilterData((prev) => ({
                        ...prev,
                        [name]: moment(dates[0]).format('YYYY-MM-DD'),
                      }))
                    }
                  />
                </div>

                <div className='col-5'>
                  <label className='d-flex align-items-center form-label fw-bold mb-2'>
                    <span>Strike</span>
                  </label>

                  <div className='d-flex align-items-center gap-2'>
                    <input
                      type='text'
                      className='form-control form-control-sm form-control-solid border-gray-400'
                      name='strike'
                      value={filterData.strike}
                      onChange={handleInputChange}
                      placeholder='473'
                    />
                  </div>
                </div>
              </div>

              {/* Risk Type  */}
              <div className='mb-10'>
                <div className='d-flex flex-wrap align-items-center gap-4'>
                  {[
                    { title: 'Standard', value: 'standard' },
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

              {/* Copy Trade */}
              <div className='btn btn-md btn-outline btn-outline-dark bg-light-dark fw-bold w-100 mb-10 d-flex align-items-center justify-content-between'>
                <span className='me-4 w-100 text-start text-gray-700'>
                  {filterData.equityType === 'Option'
                    ? `${returnPosition(filterData.position)} ${
                        filterData.ticker
                      } ${filterData.strike} ${
                        filterData.optionType === 'call' ? 'C' : 'P'
                      } ${
                        filterData.date.split(':')[0]
                          ? moment(filterData.date.split(':')[0]).format(
                              'MM/DD/YYYY'
                            )
                          : ''
                      } @ ${filterData.price} ${
                        filterData.riskType && filterData.riskType.length > 0
                          ? '(' + filterData.riskType + ')'
                          : ''
                      }`
                    : `${returnPosition(filterData.position)} ${
                        filterData.ticker
                      } @ ${filterData.price ? filterData.price : 'm'} ${
                        filterData.riskType && filterData.riskType.length > 0
                          ? '(' + filterData.riskType + ')'
                          : ''
                      }`}
                </span>

                <span className='text-dark'>Copy</span>
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
                  Apply
                </button>
              </div>
            </form>
          </div>

          <div className='tab-pane fade' id='kt_tab_pane_2' role='tabpanel'>
            {/*begin::Form */}
            <form onSubmit={handleSubmit} id='kt_modal_create_app_form'>
              <div className='fv-row mb-10'>
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
                Submit
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
