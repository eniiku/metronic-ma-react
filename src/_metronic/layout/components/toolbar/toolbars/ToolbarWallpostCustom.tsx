import React, { useState } from 'react'
import { useLayout } from '../../../core'
import { CustomModal2 } from '../../../../partials/modals/create-app-stepper/CustomModal2'

const ToolbarWallpostCustom: React.FC<{
  action: React.Dispatch<any>
}> = ({ action }) => {
  const { config } = useLayout()
  const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false)

  return (
    <div
      id='kt_app_toolbar'
      className='d-flex align-items-center justify-content-end gap-2 gap-lg-3 mb-5 mb-xxl-8'
    >
      {config.app?.toolbar?.primaryButton && (
        <button
          onClick={() => setShowCreateAppModal(true)}
          className='btn btn-sm fw-bold btn-primary'
        >
          Post WallPost
        </button>
      )}
      <CustomModal2
        show={showCreateAppModal}
        handleClose={() => setShowCreateAppModal(false)}
        action={action}
      />
    </div>
  )
}

export { ToolbarWallpostCustom }
