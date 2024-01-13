import { FC } from 'react'
import { KTIcon } from '../../../_metronic/helpers'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
// import { Dropdown1 } from '../../../_metronic/partials'

import { useQuery } from 'react-query'
import { fetchFollowers, fetchUserData } from '../../../services/api'
import _ from 'lodash'

const ProfileHeader: FC = () => {
  const location = useLocation()

  const { currentUser } = useAuth()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery('user', () => fetchUserData(currentUser?.firebaseUserId ?? ''))

  const { data: followers } = useQuery('followers', () =>
    fetchFollowers(currentUser ? `${currentUser.id}` : '')
  )

  const { data: followingUsers } = useQuery('followingUsers', () =>
    fetchFollowers(currentUser ? `${currentUser.id}` : '')
  )

  console.log(followers)
  console.log('following', followingUsers)

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          <div className='me-7 mb-4'>
            <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
              {currentUser?.pic ? (
                <img alt='User profile picture' src={currentUser.pic} />
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
                  {isLoading
                    ? '...'
                    : isError
                    ? 'error-er'
                    : user?.data?.username}
                </div>

                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <div className='d-flex align-items-center text-gray-500 mb-2'>
                    <KTIcon iconName='sms' className='fs-4 me-1' />
                    {isLoading
                      ? '...'
                      : isError
                      ? 'error-er'
                      : user?.data?.email}
                  </div>
                </div>
              </div>
            </div>

            <div className='d-flex flex-column flex-grow-1 pe-8'>
              <div className='d-flex flex-wrap'>
                <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                  <div className='d-flex align-items-center'>
                    <KTIcon
                      iconName='profile-user'
                      className='fs-3 text-success me-2'
                    />
                    <div className='fs-2 fw-bolder'>{}</div>
                  </div>

                  <div className='fw-bold fs-6 text-gray-500'>Followers</div>
                </div>

                <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                  <div className='d-flex align-items-center'>
                    <KTIcon
                      iconName='user-tick'
                      className='fs-3 text-info me-2'
                    />
                    <div className='fs-2 fw-bolder'>{}</div>
                  </div>

                  <div className='fw-bold fs-6 text-gray-500'>Following</div>
                </div>
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
                to='/profile/'
              >
                Profile{' '}
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/profile/log' && 'active')
                }
                to='log'
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
                to='performance/'
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
                to='wall-post/'
              >
                Wall Post
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/profile/settings' && 'active')
                }
                to='settings/'
              >
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export { ProfileHeader }
