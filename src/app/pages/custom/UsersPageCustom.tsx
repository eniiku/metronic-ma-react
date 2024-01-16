import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import {
  fetchAllUsers,
  fetchFollowingUserList,
  followUser,
  unFollowUser,
} from '../../../services/api'
import { KTIcon } from '../../../_metronic/helpers'
import _ from 'lodash'
import { useAuth } from '../../modules/auth'

const UsersPageCustom = () => {
  const { currentUser } = useAuth()
  const { data: users } = useQuery('users', fetchAllUsers)

  const [filteredUsers, setFilteredUsers] = useState<any[]>(users?.data)

  const { data: followingUsersList } = useQuery(
    'followingUsersList',
    fetchFollowingUserList
  )

  const userId = currentUser?.id

  const isFollowingTrue = followingUsersList?.data?.some(
    (user: any) => user._id === userId
  )

  const [isFollowing, setIsFollowing] = useState<boolean>(!!isFollowingTrue)

  useEffect(() => {
    // Update isFollowing when userId or followingUsersList changes
    const isFollowingTrue = followingUsersList?.data?.some(
      (user: any) => user._id === userId
    )
    setIsFollowing(!!isFollowingTrue)
  }, [userId, followingUsersList])

  const handleFollowClick = async (id: string) => {
    try {
      // Optimistically update the UI
      setIsFollowing(!isFollowing)

      if (isFollowing) {
        await unFollowUser(id)
      } else {
        await followUser(id)
      }
    } catch (error) {
      // Handle error and revert the UI if the API call fails
      setIsFollowing(!isFollowing)
      console.error('Follow/Unfollow failed:', error)
    }
  }

  const debouncedFollowClick = (id: string) =>
    _.debounce(() => handleFollowClick(id), 500)

  return (
    <div>
      {filteredUsers?.map((user: any) => (
        <div
          key={user?._id}
          className='d-flex align-items-center justify-content-between'
        >
          <Link
            to={`/user/${user._id}`}
            className='d-flex text-gray-900 text-hover-primary align-items-center mb-5'
          >
            <div className='symbol symbol-40px me-4'>
              {user?.profilePicture ? (
                <img
                  alt={`${user.username} Profile Pictute`}
                  src={user.profilePicture}
                />
              ) : (
                <div className='symbol-label fs-2 fw-bold bg-info text-inverse-info'>
                  {user.username.slice(0, 1)}
                </div>
              )}
            </div>

            <div className='d-flex flex-column justify-content-start fw-bold'>
              <span className='fs-7 fw-bold'>{user.username}</span>
            </div>
          </Link>

          <button
            className={`btn btn-sm bg-light  me-2 ${
              isFollowing ? 'bg-hover-danger' : 'bg-hover-primary'
            }`}
            id='kt_user_follow_button'
            onClick={() => debouncedFollowClick(user?._id)}
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
      ))}
    </div>
  )
}

export default UsersPageCustom
