import { FC, useEffect, useState } from 'react'
import { KTIcon } from '../../../helpers'
import { useQuery } from 'react-query'
import {
  fetchNotifications,
  fetchNotificationsSettings,
  handleDeleteAllNotifications,
  updateNotificationsSettings,
} from '../../../../services/api'

type SwitchStates = {
  stock: boolean
  option: boolean
  crypto: boolean
  forex: boolean
  postComment: boolean
  postLike: boolean
  [key: string]: boolean
}

const ActivityDrawerCustom: FC = () => {
  const [showSettings, setShowSettings] = useState(false)
  const [switchStates, setSwitchStates] = useState<SwitchStates>({
    stock: true,
    option: true,
    crypto: true,
    forex: true,
    postComment: true,
    postLike: true,
  })

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery('notifications', fetchNotifications)

  const notificationsData = notifications?.data

  const { data: notificationsSettings, isLoading: isSettingsLoading } =
    useQuery('notificationsSettings', fetchNotificationsSettings)

  // Initialize switch states once the data is fetched
  useEffect(() => {
    if (notificationsSettings) {
      setSwitchStates({
        stock: notificationsSettings.data.stock,
        option: notificationsSettings.data.option,
        crypto: notificationsSettings.data.crypto,
        forex: notificationsSettings.data.forex,
        postComment: notificationsSettings.data.postComment,
        postLike: notificationsSettings.data.postLike,
      })
    }
  }, [notificationsSettings])

  const handleSwitchToggle = async (id: string) => {
    // Toggle the switch optimistically
    setSwitchStates((prevStates: any) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }))

    try {
      // Send a POST request to update the switch state in the database
      await updateNotificationsSettings({ [id]: !switchStates[id] })
    } catch (error) {
      console.error('Error updating switch state:', error)
      // Revert the switch state if the API request fails
      setSwitchStates((prevStates) => ({
        ...prevStates,
        [id]: !prevStates[id],
      }))
    }
  }

  return (
    <div
      id='kt_activities'
      className='bg-body'
      data-kt-drawer='true'
      data-kt-drawer-name='activities'
      data-kt-drawer-activate='true'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'300px', 'lg': '500px'}"
      data-kt-drawer-direction='end'
      data-kt-drawer-toggle='#kt_activities_toggle'
      data-kt-drawer-close='#kt_activities_close'
    >
      <div className='card shadow-none rounded-0 w-100'>
        <div className='card-header' id='kt_activities_header'>
          <h3 className='card-title fw-bolder text-gray-900'>
            Notifications {showSettings ? 'Settings' : null}
          </h3>

          <div className='card-toolbar'>
            {/* Settings Icon */}
            <button
              type='button'
              className='btn btn-sm btn-icon btn-active-light-primary me-3'
              onClick={() => setShowSettings(!showSettings)}
            >
              <KTIcon iconName='setting-2' className='fs-2' />
            </button>

            {/* Close Drawer Icon */}
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
            {!showSettings ? (
              <div className='timeline'>
                {isLoading ? (
                  <div>Loading...</div>
                ) : notificationsData?.length > 0 ? (
                  notificationsData?.map((notification: any) => (
                    <Item1
                      key={notification._id}
                      title={notification.title}
                      subtitle={notification.subtitle}
                      type={notification.type}
                    />
                  ))
                ) : isError ? (
                  <div>Error fetching notifications</div>
                ) : (
                  <div className='text-center fs-2 py-5'>
                    You currently do not have any notifications
                  </div>
                )}
              </div>
            ) : (
              //  Settings Page
              <div>
                <div className='mb-10'>
                  <div className='text-gray-800 fs-4 fw-semibold'>
                    Enable/Disable Notification
                  </div>
                  <div className='text-gray-500 fs-7'>
                    Only enabled notification will be received
                  </div>
                </div>
                {/* List Options with switches */}
                {isSettingsLoading ? (
                  <div>loading...</div>
                ) : notificationsSettings.data !== null ? (
                  <form>
                    {[
                      { text: 'Stock Trade', id: 'stock' },
                      { text: 'Option Trade', id: 'option' },
                      { text: 'Crypto Trade', id: 'crypto' },
                      { text: 'Forex Trade', id: 'forex' },
                      { text: 'Wall Post Comment', id: 'postComment' },
                      { text: 'Wall Post Like', id: 'postLike' },
                    ].map((item) => (
                      <div
                        className='mb-5 bg-secondary rounded px-2 py-4'
                        key={item.id}
                      >
                        <div className='form-check form-switch form-check-custom form-check-solid justify-content-between'>
                          <label
                            className='form-check-label fs-5 text-gray-900 fw-medium'
                            htmlFor={item.id}
                          >
                            {item.text}
                          </label>

                          <input
                            className='form-check-input'
                            type='checkbox'
                            value=''
                            id={item.id}
                            checked={switchStates[item.id] || false}
                            onChange={() => handleSwitchToggle(item.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </form>
                ) : (
                  <div>Error fetching notifications states</div>
                )}
              </div>
            )}
          </div>
        </div>

        {showSettings ? null : (
          <div
            className='card-footer py-5 text-center'
            id='kt_activities_footer'
          >
            <button
              onClick={handleDeleteAllNotifications}
              className='btn btn-bg-body text-primary'
            >
              Delete all notifications
              <KTIcon iconName='arrow-right' className='fs-3 text-primary' />
            </button>
          </div>
        )}
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
