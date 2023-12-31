import { FC } from 'react'
import { KTIcon } from '../../../../_metronic/helpers'
import { Link, useLocation } from 'react-router-dom'

import { useQuery } from 'react-query'
import { fetchAllUsers } from '../../../../services/api'

const ProfileHeaderCustom: FC<{ userId: string }> = ({ userId }) => {
  const location = useLocation()

  const { data: users } = useQuery('users', fetchAllUsers)

  const currentUser = users?.data.find((user: any) => user._id === userId)

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          <div className='me-7 mb-4'>
            <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
              {currentUser?.profilePicture ? (
                <img
                  alt='User profile picture'
                  src={currentUser.profilePicture}
                />
              ) : (
                <div className='symbol-label fs-1 fw-bold bg-info text-inverse-info'>
                  {currentUser?.username.slice(0, 1)}
                </div>
              )}
              <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
              <div className='d-flex flex-column'>
                <div className='text-gray-800 fs-2 fw-bolder me-1'>
                  {currentUser ? currentUser.username : 'Nil'}
                </div>

                {/* <div className='d-flex flex-wrap fs-7 mb-4 pe-2 mw-350px'>
                  <p className='d-flex align-items-center text-gray-500 mb-2'>
                    <KTIcon iconName='sms' className='fs-4 me-1' />
                    {currentUser ? currentUser.profileDescription : 'NIl'}
                  </p>
                </div> */}
              </div>

              <div className='d-flex my-4'>
                <a
                  href='#'
                  className='btn btn-sm btn-light me-2'
                  id='kt_user_follow_button'
                >
                  <KTIcon iconName='check' className='fs-3 d-none' />

                  <span className='indicator-label'>Follow</span>
                  <span className='indicator-progress'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='d-flex overflow-auto h-55px'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === `/profile/${userId}` && 'active')
                }
                to={`/profile/${userId}`}
              >
                Profile
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === `/profile/${userId}/log` && 'active')
                }
                to={`/profile/${userId}/log`}
              >
                Trade Log
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === `/profile/${userId}/performance` &&
                    'active')
                }
                to={`/profile/${userId}/performance`}
              >
                Performance
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === `/profile/${userId}/wall-post` &&
                    'active')
                }
                to={`/profile/${userId}/wall-post`}
              >
                Wall Post
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export { ProfileHeaderCustom }
