import { FC, useEffect, useState } from 'react'
import { KTIcon } from '../../../_metronic/helpers'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
// import { Dropdown1 } from '../../../_metronic/partials'

import { useQuery } from 'react-query'
import {
  fetchFollowingUserList,
  fetchUserData,
  followUser,
  unFollowUser,
} from '../../../services/api'

const ProfileHeader: FC = () => {
  const location = useLocation()

  const { currentUser } = useAuth()

  const { data: user, isLoading } = useQuery('user', () =>
    fetchUserData(currentUser?.firebaseUserId ?? '')
  )

  const { data: followingUsersList } = useQuery(
    'followingUsersList',
    fetchFollowingUserList
  )

  const isFollowingTrue = followingUsersList?.data.filter(
    (user: any) => user._id === currentUser?.id
  )

  const [isFollowing, setIsFollowing] = useState<boolean>(isFollowingTrue)

  useEffect(() => {
    // Update isFollowing when userId or followingUsersList changes
    const isFollowingTrue = followingUsersList?.data.some(
      (user: any) => user._id === currentUser?.id
    )
    setIsFollowing(isFollowingTrue)
  }, [currentUser?.id, followingUsersList])

  const handleFollowClick = async () => {
    try {
      // Optimistically update the UI
      setIsFollowing(!isFollowing)

      if (isFollowing) {
        await unFollowUser(currentUser ? `${currentUser.id}` : '')
      } else {
        await followUser(currentUser ? `${currentUser.id}` : '')
      }
    } catch (error) {
      // Handle error and revert the UI if the API call fails
      setIsFollowing(!isFollowing)
      console.error('Follow/Unfollow failed:', error)
    }
  }

  const debouncedFollowClick = _.debounce(handleFollowClick, 500)

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
                  {isLoading ? '...' : user?.data?.username}
                </div>

                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <div className='d-flex align-items-center text-gray-500 mb-2'>
                    <KTIcon iconName='sms' className='fs-4 me-1' />
                    {isLoading ? '...' : user?.data?.email}
                  </div>
                </div>
              </div>

              <div className='d-flex my-4'>
                <button
                  className={`btn btn-sm bg-light  me-2 ${
                    isFollowing ? 'bg-hover-danger' : 'bg-hover-primary'
                  }`}
                  id='kt_user_follow_button'
                  onClick={debouncedFollowClick}
                >
                  <KTIcon iconName='check' className='fs-3 d-none' />

                  <span className='indicator-label'>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </span>
                  <span className='indicator-progress'>
                    {/* Please wait... */}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                </button>
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
