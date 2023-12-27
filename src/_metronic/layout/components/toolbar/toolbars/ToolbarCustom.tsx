import clsx from 'clsx'
import { useState } from 'react'
import { KTIcon } from '../../../../helpers'
import { useLayout } from '../../../core'
import { DropdownCustom } from '../../../../partials/content/dropdown/DropdownCustom'
import { CustomModal } from '../../../../partials/modals/create-app-stepper/CustomModal'

const ToolbarCustom = () => {
  const { config } = useLayout()
  const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false)
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? 'btn-light'
    : 'bg-body btn-color-gray-700 btn-active-color-primary'

  return (
    <div
      id='kt_app_toolbar'
      className='d-flex align-items-center justify-content-end gap-2 gap-lg-3 mb-5 mb-xxl-8'
    >
      {config.app?.toolbar?.filterButton && (
        <div className='m-0'>
          <a
            href='#'
            className={clsx(
              'btn btn-sm btn-flex fw-bold',
              daterangepickerButtonClass
            )}
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <KTIcon iconName='filter' className='fs-6 text-muted me-1' />
            Filter
          </a>

          <DropdownCustom />
        </div>
      )}

      {config.app?.toolbar?.daterangepickerButton && (
        <div
          data-kt-daterangepicker='true'
          data-kt-daterangepicker-opens='left'
          className={clsx(
            'btn btn-sm fw-bold  d-flex align-items-center px-4',
            daterangepickerButtonClass
          )}
        >
          <div className='text-gray-600 fw-bold'>Loading date range...</div>
          <KTIcon iconName='calendar-8' className='fs-1 ms-2 me-0' />
        </div>
      )}

      {config.app?.toolbar?.secondaryButton && (
        <a href='#' className='btn btn-sm btn-flex btn-light fw-bold'>
          Filter
        </a>
      )}

      {config.app?.toolbar?.primaryButton && (
        <a
          href='#'
          onClick={() => setShowCreateAppModal(true)}
          className='btn btn-sm fw-bold btn-primary'
        >
          Post Idea
        </a>
      )}
      <CustomModal
        show={showCreateAppModal}
        handleClose={() => setShowCreateAppModal(false)}
      />
    </div>
  )
}

export { ToolbarCustom }
