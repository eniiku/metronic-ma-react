import clsx from 'clsx'
import React, { useState } from 'react'
import { KTIcon } from '../../../../helpers'
import { useLayout } from '../../../core'
import { DropdownCustom } from '../../../../partials/content/dropdown/DropdownCustom'
import { CustomModal } from '../../../../partials/modals/create-app-stepper/CustomModal'

const ToolbarCustom: React.FC<{
  action: React.Dispatch<any>
  loader: React.Dispatch<any>
}> = ({ action, loader }) => {
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
          <button
            className={clsx(
              'btn btn-sm btn-flex fw-bold',
              daterangepickerButtonClass
            )}
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <KTIcon iconName='filter' className='fs-6 text-muted me-1' />
            Filter
          </button>

          <DropdownCustom action={action} loader={loader} />
        </div>
      )}

      {config.app?.toolbar?.primaryButton && (
        <button
          onClick={() => setShowCreateAppModal(true)}
          className='btn btn-sm fw-bold btn-primary'
        >
          Post Idea
        </button>
      )}
      <CustomModal
        show={showCreateAppModal}
        handleClose={() => setShowCreateAppModal(false)}
      />
    </div>
  )
}

export { ToolbarCustom }
