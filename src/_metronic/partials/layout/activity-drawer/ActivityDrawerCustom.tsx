import { FC } from 'react'
import { KTIcon } from '../../../helpers'
import { useQuery } from 'react-query'
import {
  fetchNotifications,
  handleDeleteAllNotifications,
} from '../../../../services/api'

const ActivityDrawerCustom: FC = () => {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery('notifications', fetchNotifications)

  console.log('notigs', notifications)

  const notificationsData = notifications?.data
  return (
    <div
      id='kt_activities'
      className='bg-body'
      data-kt-drawer='true'
      data-kt-drawer-name='activities'
      data-kt-drawer-activate='true'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'300px', 'lg': '400px'}"
      data-kt-drawer-direction='end'
      data-kt-drawer-toggle='#kt_activities_toggle'
      data-kt-drawer-close='#kt_activities_close'
    >
      <div className='card shadow-none rounded-0'>
        <div className='card-header' id='kt_activities_header'>
          <h3 className='card-title fw-bolder text-gray-900'>Activity Logs</h3>

          <div className='card-toolbar'>
            <button
              type='button'
              className='btn btn-sm btn-icon btn-active-light-primary me-n5'
              id='kt_activities_close'
            >
              <KTIcon iconName='cross' className='fs-1' />
            </button>
          </div>
        </div>
        <div className='card-body position-relative' id='kt_activities_body'>
          <div
            id='kt_activities_scroll'
            className='position-relative scroll-y me-n5 pe-5'
            data-kt-scroll='true'
            data-kt-scroll-height='auto'
            data-kt-scroll-wrappers='#kt_activities_body'
            data-kt-scroll-dependencies='#kt_activities_header, #kt_activities_footer'
            data-kt-scroll-offset='5px'
          >
            <div className='timeline'>
              {isLoading ? (
                <div>Loading...</div>
              ) : notificationsData?.length > 0 ? (
                notificationsData?.map((notification: any) => (
                  <Item1
                    title={notification.title}
                    subtitle={notification.subtitle}
                    type={notification.type}
                  />
                ))
              ) : isError ? (
                <div>Error fetching notifications</div>
              ) : (
                <div className='text-center fs-2 py-5'>
                  You Currently do not have any notifications
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='card-footer py-5 text-center' id='kt_activities_footer'>
          <button
            onClick={handleDeleteAllNotifications}
            className='btn btn-bg-body text-primary'
          >
            Delete all notifications
            <KTIcon iconName='arrow-right' className='fs-3 text-primary' />
          </button>
        </div>
      </div>
    </div>
  )
}
export { ActivityDrawerCustom }

const Item1: FC<{ title: string; subtitle: string; type: string }> = ({
  title,
  subtitle,
  type,
}) => {
  return (
    <div className='timeline-item'>
      <div className='timeline-line w-40px'></div>

      <div className='timeline-icon symbol symbol-circle symbol-40px me-4'>
        <div className='symbol-label bg-light'>
          <KTIcon
            iconName={`${type === 'follow' ? 'user-tick' : 'message-text-2'}`}
            className='fs-2 text-gray-500'
          />
        </div>
      </div>

      <div className='timeline-content mb-10 mt-n1'>
        <div className='pe-3 mb-5'>
          <div className='fs-5 fw-bold mb-2'>{title}</div>
          <div className='d-flex align-items-center mt-1 fs-6'>
            <div className='text-muted me-2 fs-7'>
              {/* Added at 4:23 PM by */}
              {subtitle}
            </div>

            {/* <div
              className='symbol symbol-circle symbol-25px'
              data-bs-toggle='tooltip'
              data-bs-boundary='window'
              data-bs-placement='top'
              title='Nina Nilson'
            >
              <img src={toAbsoluteUrl('media/avatars/300-14.jpg')} alt='img' />
            </div> */}
          </div>
        </div>

        {/* <div className='overflow-auto pb-5'>
          <div className='d-flex align-items-center border border-dashed border-gray-300 rounded min-w-750px px-7 py-3 mb-5'>
            <a
              href='#'
              className='fs-5 text-gray-900 text-hover-primary fw-bold w-375px min-w-200px'
            >
              Meeting with customer
            </a>

            <div className='min-w-175px pe-2'>
              <span className='badge badge-light text-muted'>
                Application Design
              </span>
            </div>

            <div className='symbol-group symbol-hover flex-nowrap flex-grow-1 min-w-100px pe-2'>
              <div className='symbol symbol-circle symbol-25px'>
                <img src={toAbsoluteUrl('media/avatars/300-2.jpg')} alt='img' />
              </div>

              <div className='symbol symbol-circle symbol-25px'>
                <img
                  src={toAbsoluteUrl('media/avatars/300-14.jpg')}
                  alt='img'
                />
              </div>

              <div className='symbol symbol-circle symbol-25px'>
                <div className='symbol-label fs-8 fw-bold bg-primary text-inverse-primary'>
                  A
                </div>
              </div>
            </div>

            <div className='min-w-125px pe-2'>
              <span className='badge badge-light-primary'>In Progress</span>
            </div>

            <a
              href='#'
              className='btn btn-sm btn-light btn-active-light-primary'
            >
              View
            </a>
          </div>
        </div> */}
      </div>
    </div>
  )
}
