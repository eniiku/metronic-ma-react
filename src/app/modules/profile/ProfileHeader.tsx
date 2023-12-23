import { FC } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
// import { Dropdown1 } from '../../../_metronic/partials'

import { useQuery } from 'react-query'
import { fetchUserData } from '../../../services/api'

const ProfileHeader: FC = () => {
  const location = useLocation()

  const { currentUser } = useAuth()

  const { data: user, isLoading } = useQuery('user', () =>
    fetchUserData(currentUser?.firebaseUserId ?? '')
  )

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          <div className='me-7 mb-4'>
            <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
              <img
                src={toAbsoluteUrl('media/avatars/300-1.jpg')}
                alt='Metornic'
              />
              <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
              <div className='d-flex flex-column'>
                <a
                  href='#'
                  className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'
                >
                  {isLoading ? '...' : user?.data?.username}
                </a>

                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-500 text-hover-primary mb-2'
                  >
                    <KTIcon iconName='sms' className='fs-4 me-1' />
                    {isLoading ? '...' : user?.data?.email}
                  </a>
                </div>
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
                  (location.pathname === '/profile' && 'active')
                }
                to='/profile'
              >
                Profile
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/profile/log' && 'active')
                }
                to='/profile/log'
              >
                Trade Log
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/profile/performance' && 'active')
                }
                to='/profile/performance'
              >
                Performance
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/profile/wall-post' && 'active')
                }
                to='/profile/wall-post'
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

export { ProfileHeader }
