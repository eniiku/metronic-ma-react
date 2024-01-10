import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from 'react-bootstrap'
import { KTIcon } from '../../../helpers'
import { postWallpost } from '../../../../services/api'

type Props = {
  show: boolean
  handleClose: () => void
  action: React.Dispatch<any>
}

const modalsRoot = document.getElementById('root-modals') || document.body

export const CustomModal2 = ({ show, handleClose, action }: Props) => {
  const [message, setMessage] = useState<{
    content: string
    image: any
    position: any
    sentiment: 'bearish' | 'bullish' | 'any'
  }>({ content: '', image: null, position: '', sentiment: 'any' })

  const [error, setError] = useState<string>('')

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
          <div className='fv-row mb-10'>
            <textarea
              className='form-control form-control-lg form-control-solid resize-none min-h-80px'
              rows={2}
              placeholder='Share an idea (use $ before ticker e.g, $AAPL)'
              value={message.content}
              onChange={handleInputChange}
            ></textarea>
            {/* <!--begin::Image input--> */}

            {message.image ? (
              <div
                className='image-input image-input-bg-muted mt-10 mx-auto'
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
          </div>

          {error ? (
            <div className='fv-plugins-message-container mb-5'>
              <div
                data-field='trade_description'
                data-validator='notEmpty'
                className='fv-help-block'
              >
                {error || 'Textarea can not be empty'}
              </div>
            </div>
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
