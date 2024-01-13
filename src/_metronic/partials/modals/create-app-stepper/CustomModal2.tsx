import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from 'react-bootstrap'
import { KTIcon } from '../../../helpers'
import { fetchUserTradeSummary, postWallpost } from '../../../../services/api'
import { setAuth, useAuth } from '../../../../app/modules/auth'
import { useQuery } from 'react-query'

type Props = {
  show: boolean
  handleClose: () => void
  action: React.Dispatch<any>
}

const modalsRoot = document.getElementById('root-modals') || document.body

export const CustomModal2 = ({ show, handleClose, action }: Props) => {
  const { currentUser } = useAuth()
  const [message, setMessage] = useState<{
    content: string
    image: any
    position: any
    sentiment: any
  }>({ content: '', image: null, position: '', sentiment: 'any' })

  const [ticker, setTicker] = useState('')

  const [error, setError] = useState<string>('')

  const [page, setPage] = useState(1)

  const [isAttachModalVisible, setIsAttachModalVisible] = useState(false)
  const [positionData, setPostionData] = useState({})

  const {
    data: userSummary,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    'userSummary',
    () =>
      fetchUserTradeSummary(
        currentUser ? `${currentUser.id}` : '',
        page,
        ticker
      ),
    {
      enabled: false, // Initial fetch is disabled
    }
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage((prevMessage) => ({
      ...prevMessage,
      content: e.target.value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setMessage((prevMessage) => ({
        ...prevMessage,
        image: file,
      }))
    }
  }

  const handleSentimentClick = (sentiment: string) => {
    setMessage((prevMessage: any) => ({
      ...prevMessage,
      sentiment: sentiment,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate Wallpost content
    !message?.content?.trim()
      ? setError('Textarea cannot be blank')
      : setError('')

    // Validate all required fields
    if (!message.content.trim() || !message.image || !message.sentiment) {
      setError('All fields must be filled')
      return
    } else {
      setError('')
    }

    try {
      await postWallpost(message)

      setMessage({ content: '', image: null, position: '', sentiment: 'any' })

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

  const handleSearchTrade = () => {
    if (ticker !== '') {
      // Call the API and refetch data
      console.log(ticker)
      refetch()
    } else {
      console.error('Ticker is empty')
    }
  }

  const onSubmitTrade = (data: any) => {
    setPostionData(data)

    setIsAttachModalVisible(false)

    const sentiment = data.tradeDirection === 'BTO' ? 'Bullish' : 'Bearish'

    setMessage((prevMessage) => ({
      ...prevMessage,
      sentiment: sentiment,
    }))

    // let tickerName = ''
    // if (data.equityType == 'Option') tickerName = data?.ticker?.split('_')[0]
    // else tickerName = data.ticker
    // setMessage((prevMessage) => ({
    //   ...prevMessage,
    //   content: `$${tickerName} ${prevMessage.content}`,
    // }))

    setMessage((prevMessage) => ({
      ...prevMessage,
      position: data,
    }))
  }

  console.log('summaryyyyyyyyy', userSummary)

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
        <h2>Post Your Idea</h2>
        {/* begin::Close */}
        <div
          className='btn btn-sm btn-icon btn-active-color-primary'
          onClick={handleClose}
        >
          <KTIcon className='fs-1' iconName='cross' />
        </div>
        {/* end::Close */}
      </div>

      <div className='modal-body py-lg-10 px-lg-10 text-center'>
        {/*begin::Form */}
        <form onSubmit={handleSubmit} id='kt_modal_create_app_form'>
          <div className='fv-row mb-6'>
            <textarea
              className='form-control form-control-lg form-control-solid resize-none min-h-80px'
              rows={2}
              placeholder='Share an idea (use $ before ticker e.g, $AAPL)'
              value={message.content}
              onChange={handleInputChange}
            ></textarea>

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

          {/* <!--begin::Image input--> */}

          {message.image ? (
            <div
              className='image-input image-input-bg-muted mb-4 mx-auto'
              data-kt-image-input='true'
            >
              {/* Image preview */}
              {message.image && (
                <img
                  src={URL.createObjectURL(message.image)}
                  alt='Preview'
                  className='image-input-wrapper w-200px h-150px'
                />
              )}

              {/* Remove button */}
              <span
                className='btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='remove'
                data-bs-toggle='tooltip'
                data-bs-dismiss='click'
                title='Remove wallpost image'
                onClick={() =>
                  setMessage((prevMessage) => ({
                    ...prevMessage,
                    image: null,
                  }))
                }
              >
                <i className='ki-outline ki-cross fs-1'></i>
              </span>
            </div>
          ) : null}
          {/* <!--end::Image input--> */}

          {isAttachModalVisible ? (
            <div className='fv-row py-5 my-5 className bg-light-warning px-4 rounded'>
              <label className='fs-5 fw-semibold mb-2'>
                <span className=''>Attach Trade</span>
              </label>

              <div>
                <div className='d-flex align-items-center gap-2'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-muted'
                    placeholder='Enter ticker'
                    value={ticker}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setTicker(e.target.value.toLocaleUpperCase())
                    }}
                  />

                  <button
                    className='btn btn-icon btn-secondary'
                    type='button'
                    onClick={handleSearchTrade}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RotatingLines
                        visible={true}
                        width='15'
                        strokeColor='gray'
                        strokeWidth='3'
                        animationDuration='0.75'
                        ariaLabel='rotating-lines-loading'
                      />
                    ) : (
                      <KTIcon iconName='magnifier' className='fs-2' />
                    )}
                  </button>
                </div>
              </div>

              <div>
                {!isLoading ? (
                  <TradeWidget
                    data={userSummary?.data}
                    isError={isError}
                    isLoading={isLoading}
                    className='mt-4'
                    onClick={onSubmitTrade}
                  />
                ) : (
                  <RotatingLines
                    visible={true}
                    width='15'
                    strokeColor='gray'
                    strokeWidth='3'
                    animationDuration='0.75'
                    ariaLabel='rotating-lines-loading'
                  />
                )}
              </div>
            </div>
          ) : Object.keys(positionData).length !== 0 ? (
            <TradeWidgetCustom2 className='mb-6' data={positionData} />
          ) : null}

          {/* begin:Actions */}
          <div className='d-flex flex-stack '>
            <div className='me-2'>
              <button
                type='button'
                className={`btn btn-outline btn-md me-3 ${
                  message.sentiment === 'bearish'
                    ? 'btn-danger'
                    : 'btn-outline-danger'
                }`}
                onClick={() => handleSentimentClick('bearish')}
              >
                BEARISH
              </button>

              <button
                type='button'
                className={`btn btn-outline btn-md me-3 ${
                  message.sentiment === 'bullish'
                    ? 'btn-success'
                    : 'btn-outline-success'
                }`}
                onClick={() => handleSentimentClick('bullish')}
              >
                BULLISH
              </button>
            </div>

            <div>
              {/* <!--begin::Edit button--> */}
              <label
                className='btn btn-icon btn-lg btn-active-light-primary w-35px h-35px bg-body shadow me-2'
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                data-bs-dismiss='click'
                title='Add image to wallpost'
              >
                <KTIcon iconName='picture' className='fs-1 ms-1 me-2' />

                {/* <!--begin::Inputs--> */}
                <input
                  type='file'
                  name='wallpost_image'
                  accept='.png, .jpg, .jpeg .gif'
                  className='d-none'
                  onChange={handleImageChange}
                />
                <input type='hidden' name='wallpost_image_remove' />
                {/* <!--end::Inputs--> */}
              </label>
              {/* <!--end::Edit button--> */}

              {/* Attach Trade Button */}
              <button
                type='button'
                className='btn btn-sm btn-icon'
                onClick={() => setIsAttachModalVisible((prev) => !prev)}
              >
                <KTIcon iconName='paper-clip' className='fs-1 ms-1 me-2' />
              </button>

              <button
                type='submit'
                className='btn btn-lg btn-primary'
                disabled={!message?.content?.trim()}
                data-kt-stepper-action='submit'
              >
                Submit
              </button>
            </div>
          </div>
          {/* end::Actions */}
        </form>
        {/*end::Form */}
      </div>
    </Modal>,
    modalsRoot
  )
}

import moment from 'moment'
import _ from 'lodash'

import { getTradePrice } from '../../../../lib/utils'
import { Loading } from '../../../../app/components/Loading'
import NoData from '../../../../app/components/NoData'
import { RotatingLines } from 'react-loader-spinner'
import { TradeWidgetCustom2 } from '../../widgets/custom/TradeWidgetCustom2'

export function TradeWidget({
  className,
  data,
  showTitle,
  isLoading,
  isError,
  onClick,
}: {
  className?: string
  data: any
  showTitle?: boolean
  isLoading: boolean
  isError: boolean
  onClick: (data: any) => void
}) {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      {showTitle ? (
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Trades</span>
          </h3>
        </div>
      ) : null}
      {/* end::Header */}
      {/* begin::Body */}

      <div className='card-body p-0'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4 text-center'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='min-w-60px rounded-start'>Coin</th>
                <th className='min-w-60px'>Option</th>
                <th className='min-w-60px'>Price Profit/Loss</th>
                <th className='min-w-60px'>% Profit/Loss</th>
                <th className='min-w-60px'>Date</th>
                <th className='min-w-60px'>Trade</th>
                <th className='min-w-60px'>$(c)</th>
                <th className='min-w-60px rounded-end'>@</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            {
              // Set Table Body to null if any of these matches
              isLoading || isError ? null : (
                <tbody>
                  {data?.summary_data.map((summary: any) => {
                    const equityType = summary.equityType
                    const entryPrice = _.result(summary, 'entryPrice', 0)
                      ? equityType === 'Crypto'
                        ? _.result(summary, 'entryPrice', 0)?.toFixed(3)
                        : _.result(summary, 'entryPrice', 0)?.toFixed(2)
                      : '0'

                    const profitOrLossPercentage =
                      summary.profitOrLossPercentage
                        ? summary.profitOrLossPercentage?.toFixed(2)
                        : 0

                    const profitOrLossDifference =
                      summary.profitOrLossDifference
                        ? summary.profitOrLossDifference.toFixed(2)
                        : 0

                    let tradeDirection = summary.tradeDirection

                    const ticker = _.result(summary, 'ticker', '')
                    const tickerName = ticker?.split('_')[0]
                    const month = ticker?.substring(1, 2)
                    const date = ticker?.substring(2, 4)
                    const year = ticker?.substring(4, 6)

                    tradeDirection =
                      tradeDirection !== '' && tradeDirection === 'BTO'
                        ? 'C'
                        : 'P'

                    const expiryDate = `${month}/${date}/${year}`
                    const expDate = moment(expiryDate, 'MM/DD/YYYY').format(
                      'MMM DD'
                    )

                    const given = moment(expiryDate, 'MM/DD/YYYY')
                    const current = moment().startOf('day')
                    const daysOpens = moment
                      .duration(given.diff(current))
                      .asDays()
                    const openDays = Math.floor(daysOpens)

                    return summary?.tradeData.map((item: any) => {
                      const transactionType = _.result(
                        item,
                        'transactionType',
                        ''
                      ) as string
                      const isOpen = _.result(item, 'isOpen', false)
                      const strikePrice = ticker?.substring(6)

                      return (
                        <tr
                          key={item?._id}
                          data-bs-toggle='modal'
                          data-bs-target='#kt_modal_custom'
                          className='bg-hover-light hover-elevate-down cursor-pointer'
                          onClick={() => onClick(summary)}
                        >
                          <td>
                            <div className=' fw-bold  mb-1 fs-9'>
                              {tickerName}
                            </div>
                          </td>
                          <td>
                            <div
                              className={`fw-bold  mb-1 fs-9 ${
                                transactionType === 'Debit'
                                  ? 'text-success'
                                  : 'text-danger'
                              }`}
                            >
                              {transactionType === 'Debit' ? 'BOUGHT' : 'SOLD'}
                            </div>
                          </td>
                          <td>
                            <div
                              className={` fw-bold  mb-1 fs-9 ${
                                profitOrLossDifference > 0
                                  ? 'text-success'
                                  : profitOrLossDifference < 0
                                  ? 'text-danger'
                                  : ''
                              }`}
                            >
                              {`$${getTradePrice(
                                equityType,
                                profitOrLossDifference
                              )}`}
                            </div>
                          </td>
                          <td>
                            <div className={`fw-bold  mb-1 fs-9 `}>
                              {profitOrLossPercentage}
                            </div>
                          </td>
                          <td>
                            {openDays ? (
                              <div className={` fw-bold  mb-1 fs-9 `}>
                                {expDate} {`(${openDays}D)`}
                              </div>
                            ) : null}
                          </td>
                          <td>
                            <div className={` fw-bold  mb-1 fs-9 `}>
                              {isOpen ? 'Open' : 'Closed'}
                            </div>
                          </td>
                          <td>
                            {strikePrice ? (
                              <div className='text-gray-900 fw-bold  mb-1 fs-9'>
                                {`$${strikePrice}`} ({tradeDirection})
                              </div>
                            ) : null}
                          </td>
                          <td>
                            <div className='text-gray-900 fw-bold  mb-1 fs-9'>
                              {`$${entryPrice}`}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  })}
                </tbody>
              )
            }
            {/* end::Table body */}
          </table>
          {/* end::Table */}

          {/* Check api status */}
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <NoData type='error' message='Error Loading Trades' />
          ) : data?.summary_data?.length <= 0 ? (
            <NoData type='error' message='No Data Found' />
          ) : null}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}
