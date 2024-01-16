import moment from 'moment'
import _ from 'lodash'

import { getTradePrice } from '../../../../lib/utils'
import { Link, useNavigate } from 'react-router-dom'
import { Loading } from '../../../../app/components/Loading'
import NoData from '../../../../app/components/NoData'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { RotatingLines } from 'react-loader-spinner'
import { useState } from 'react'

export function TradeWidget({
  className,
  data,
  showTitle,
  isLoading,
  isError,
  isFilterLoading,
}: {
  className: string
  data: any
  showTitle?: boolean
  isLoading: boolean
  isError: boolean
  isFilterLoading: boolean
}) {
  const navigate = useNavigate()

  const handleClick = (id: string) => {
    navigate(`/trade/${id}`)
  }

  // State to track whether the dropdown is open for each row
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Function to toggle the dropdown for a specific row
  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prevId: any) => (prevId === id ? null : id))
  }
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

      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4 text-center'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='min-w-125px rounded-start'>Ticker</th>
                <th className='min-w-125px'>Equity Type</th>
                <th className='min-w-125px'>Price Profit/Loss</th>
                <th className='min-w-125'>% Profit/Loss</th>
                <th className='min-w-125px'>Date</th>
                <th className='min-w-125px'>Trade</th>
                <th className='min-w-125px'>$(c)</th>
                <th className='min-w-125px'>@</th>
                <th className='min-w-70px rounded-end'></th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            {
              // Set Table Body to null if any of these matches
              isFilterLoading || isLoading || isError ? null : (
                <tbody>
                  {data?.summary_data.map((summary: any) => {
                    console.log('summary', summary)
                    const username = _.result(summary, 'user.username', '')
                    const profilePicture = _.result(
                      summary,
                      'user.profilePicture',
                      ''
                    )
                    const userId = _.result(summary, 'user._id', '')

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

                    const ticker = _.result(summary, 'ticker', '')
                    const tickerName = ticker?.split('_')[0]
                    const month = ticker?.substring(1, 2)
                    const date = ticker?.substring(2, 4)
                    const year = ticker?.substring(4, 6)

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
                    const strikePrice = ticker?.substring(6)

                    let tradeDirectionSymbol = summary?.tradeDirection

                    tradeDirectionSymbol =
                      tradeDirectionSymbol !== '' &&
                      tradeDirectionSymbol === 'BTO'
                        ? 'C'
                        : 'P'

                    return (
                      <>
                        <tr
                          key={summary?._id}
                          data-bs-toggle='modal'
                          data-bs-target='#kt_modal_custom'
                          className='bg-hover-light hover-elevate-down cursor-pointer'
                          onClick={() => toggleDropdown(summary?._id)}
                        >
                          <td>
                            <div className=' fw-bold  mb-1 fs-6'>
                              <img
                                src={toAbsoluteUrl(
                                  summary?.tradeDirection === 'BTO'
                                    ? 'images/bull.png'
                                    : 'images/bear.png'
                                )}
                                style={
                                  {
                                    // filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(120deg)',
                                  }
                                }
                                className='w-30px me-4'
                                alt='sentiment icon'
                              />
                              <span>{tickerName}</span>
                            </div>
                          </td>
                          <td>
                            <div className={`fw-bold mb-1 fs-6`}>
                              {equityType?.toUpperCase()}
                            </div>
                          </td>
                          <td>
                            <div
                              className={` fw-bold  mb-1 fs-6 ${
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
                            <div className={`fw-bold  mb-1 fs-6 `}>
                              {profitOrLossPercentage}
                            </div>
                          </td>
                          <td>
                            {openDays ? (
                              <div className={` fw-bold  mb-1 fs-6 `}>
                                {expDate} {`(${openDays}D)`}
                              </div>
                            ) : null}
                          </td>
                          <td>
                            <div className={` fw-bold  mb-1 fs-6 `}>
                              {summary?.isOpen ? 'Open' : 'Closed'}
                            </div>
                          </td>
                          <td>
                            {strikePrice ? (
                              <div className='text-gray-900 fw-bold  mb-1 fs-6'>
                                {`$${strikePrice}`} ({tradeDirectionSymbol})
                              </div>
                            ) : null}
                          </td>
                          <td>
                            <div className='text-gray-900 fw-bold  mb-1 fs-6'>
                              {`$${entryPrice}`}
                            </div>
                          </td>

                          <button
                            className='btn btn-icon p-0 btn-info mt-2'
                            onClick={() => toggleDropdown(summary?._id)}
                          >
                            <KTIcon
                              className='fs-1'
                              iconName={
                                openDropdownId === summary?._id ? 'up' : 'down'
                              }
                            />
                          </button>
                        </tr>

                        {/* Additional content that slides down when the dropdown is open */}
                        {openDropdownId === summary?._id && (
                          <tr
                            className='bg-secondary rounded-bottom-sm hover-elevate-up cursor-pointer'
                            onClick={() => handleClick(summary?.summaryId)}
                          >
                            <td colSpan={12}>
                              <div className='d-flex align-items-center justify-content-center gap-12'>
                                <Link
                                  to={`/user/${userId}`}
                                  className='d-flex align-items-center gap-2 text-gray-800'
                                >
                                  <div className='symbol symbol-40px me-4'>
                                    {profilePicture ? (
                                      <img
                                        alt={`${username} Profile Pictute`}
                                        src={profilePicture}
                                      />
                                    ) : (
                                      <div className='symbol-label fs-2 fw-bold bg-info text-inverse-info'>
                                        {username.slice(0, 1)}
                                      </div>
                                    )}
                                  </div>

                                  <div className='d-flex flex-column justify-content-start fw-bold'>
                                    <span className='fs-7 fw-bold text-hover-info'>
                                      {username}
                                    </span>
                                  </div>
                                </Link>

                                <div className='w-50'>
                                  {summary?.tradeData
                                    .slice(0, 2)
                                    .map((option: any) => {
                                      return (
                                        <>
                                          <div className=''>
                                            <div>
                                              {option?.comment ? (
                                                <div>
                                                  <span className='fw-bold text-warning p-2 pt-0 text-nowrap'>
                                                    Reason:
                                                  </span>{' '}
                                                  <span className='text-gray-600'>
                                                    {option?.comment}
                                                  </span>
                                                </div>
                                              ) : null}
                                            </div>
                                            <div
                                              key={option._id}
                                              className='d-flex align-items-center justify-content-between mb-2'
                                            >
                                              <div
                                                className={`rounded-2 w-80px text-center py-1  fw-bold fs-7 ${
                                                  option.transactionType ===
                                                  'Debit'
                                                    ? 'bg-success'
                                                    : 'bg-danger'
                                                }`}
                                              >
                                                {option.transactionType ===
                                                'Debit'
                                                  ? 'BOUGHT'
                                                  : 'SOLD'}
                                              </div>

                                              <div className='d-flex align-items-center fw-semibold fs-8'>
                                                <div className='bg-gray-600 text-white-gray-600 rounded-start-2 p-2'>
                                                  {expDate}
                                                </div>

                                                <div className='bg-white-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2'>
                                                  {`${openDays}D`}
                                                </div>
                                              </div>

                                              <div className='d-flex align-items-center fw-semibold fs-8'>
                                                <div className='bg-gray-600 text-white-gray-600 rounded-start-2 p-2'>
                                                  {`$${strikePrice}`}
                                                </div>
                                                <div className='bg-white-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2'>
                                                  {option?.tradeDirection}
                                                </div>
                                              </div>

                                              <div className='d-flex align-items-center fw-semibold fs-8 gap-2'>
                                                <div>@</div>
                                                <div className='bg-gray-600 text-white-gray-600 rounded-2 p-2'>
                                                  {`$${
                                                    option.price
                                                      ? option.price
                                                      : entryPrice
                                                  }`}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })}
                                </div>

                                <button
                                  className='btn btn-sm btn-primary'
                                  onClick={() => handleClick(summary?._id)}
                                >
                                  See details
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              )
            }
            {/* end::Table body */}
          </table>
          {/* end::Table */}

          {/* Check api status */}
          {isFilterLoading ? (
            <Loading />
          ) : isLoading ? (
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
