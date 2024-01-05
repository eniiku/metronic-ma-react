import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from 'react-bootstrap'
import { KTIcon } from '../../../helpers'
import { postTrades } from '../../../../services/api'

type Props = {
  show: boolean
  handleClose: () => void
}

const modalsRoot = document.getElementById('root-modals') || document.body

export const CustomModal = ({ show, handleClose }: Props) => {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate trade description
    !message.trim()
      ? setError('Please fill in a trade description in the proper format')
      : setError('')

    try {
      // Make a POST request using Axios
      await postTrades(message)

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

      <div className='modal-body py-lg-10 px-lg-10'>
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
    </Modal>,
    modalsRoot
  )
}
