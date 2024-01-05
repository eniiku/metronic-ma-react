import { FC, useEffect, useState } from 'react'
import { KTIcon } from '../../../helpers'
import { TradeWidgetCustom2 } from './TradeWidgetCustom2'
import { useQuery } from 'react-query'
import {
  fetchWallPostsDetails,
  handleLikeWallPost,
} from '../../../../services/api'
import { useAuth } from '../../../../app/modules/auth'
import { initSocket } from '../../../../services/socket'

type Props = {
  className: string
  data: any
}

export const FeedsWidgetCustom: FC<Props> = ({ className, data }) => {
  const { currentUser } = useAuth()

  console.log('Data', data)

  const liked = data?.likes.some(
    (like: any) => like.likedBy._id === currentUser?.id
  )

  const { data: wallpostDetails } = useQuery(
    'wallpostDetails',
    () => fetchWallPostsDetails(data?._id) // Pass the wallpostId as a parameter
  )

  const [isLiked, setIsLiked] = useState(liked)
  const [likesCount, setLikesCount] = useState<number>(data?.likesCount || 0)

  useEffect(() => {
    const socket = initSocket()

    // Listen for post-liked and post-unliked events
    socket.on('post-liked', (likedData) => {
      // Update the state or refetch data
      console.log('Post liked:', likedData)
      if (likedData?.likedBy === currentUser?.id) {
        setIsLiked(true)
        setLikesCount((prev: number) => prev + 1) // Increase likes count optimistically
      }
    })

    socket.on('post-unliked', (unlikedData) => {
      if (unlikedData?.likedBy === currentUser?.id) {
        setIsLiked(false)
        setLikesCount((prev: number) => Math.max(0, prev - 1)) // Decreases likes count optimistically
      }
    })

    return () => {
      // Disconnect the socket when the component unmounts
      socket.disconnect()
    }
  }, [data?.id, isLiked])

  const handleLikeClick = async () => {
    try {
      // Check if the post is already liked by the current user
      if (isLiked) {
        // If liked, unlike the post
        setIsLiked(false)
        setLikesCount((prevCount) => Math.max(0, prevCount - 1))
        await handleLikeWallPost(data?._id)
      } else {
        // If not liked, like the post
        setIsLiked(true)
        setLikesCount((prevCount) => prevCount + 1)
        await handleLikeWallPost(data?._id)
      }
    } catch (error) {
      // Handle errors
      setIsLiked(!isLiked)
      setLikesCount((prevCount) =>
        isLiked ? prevCount + 1 : Math.max(0, prevCount - 1)
      )
      console.error('Error liking/unliking post', error)
    }
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className='card-body pb-0'>
        {/* begin::Header */}
        <div className='d-flex align-items-center mb-5'>
          {/* begin::User */}
          <div className='d-flex align-items-center flex-grow-1'>
            {/* begin::Avatar */}
            <div className='symbol symbol-45px me-5'>
              <img
                src={
                  data?.author.profilePicture ? data?.author.profilePicture : ''
                }
                alt=''
              />
            </div>
            {/* end::Avatar */}

            {/* begin::Info */}
            <div className='d-flex flex-column'>
              <a
                href='#'
                className='text-gray-800 text-hover-primary fs-6 fw-bold'
              >
                {data?.author.username}
              </a>
            </div>
            {/* end::Info */}
          </div>
          {/* end::User */}

          {/* begin::Menu */}
          {/* <div className='my-0'>
            <button
              type='button'
              className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
              data-kt-menu-trigger='click'
              data-kt-menu-placement='bottom-end'
              data-kt-menu-flip='top-end'
            >
              <KTIcon iconName='category' className='fs-2' />
            </button>
            <Dropdown1 />
          </div> */}
          {/* end::Menu */}
        </div>
        {/* end::Header */}

        {/* begin::Post */}
        <div className='mb-5'>
          {/* begin::Image */}
          {data?.image ? (
            <div
              className='bgi-no-repeat bgi-size-auto bgi-position-center rounded min-h-250px mb-5'
              style={{
                backgroundImage: `url('${data?.image ? data?.image : ''}}')`,
              }}
            ></div>
          ) : null}
          {/* end::Image */}

          {/* begin::Text */}
          <div className='text-gray-800 mb-5'>{data?.content}</div>
          {/* end::Text */}

          {/* begin:: Custom Trade */}
          <TradeWidgetCustom2 className='my-4' data={data?.position} />
          {/* end:: Custom Trade */}

          {/* begin::Toolbar */}
          <div className='d-flex align-items-center mb-5'>
            <a
              href='#'
              className='btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4'
            >
              <KTIcon iconName='message-text-2' className='fs-3' />
              {wallpostDetails?.data?.comments?.length}
            </a>

            <button
              onClick={handleLikeClick}
              className={`btn btn-sm  btn-active-light-danger px-4 py-2 ${
                isLiked ? 'btn-light-danger' : 'btn-light'
              }`}
            >
              <KTIcon iconName='heart' className='fs-2' />
              {likesCount}
            </button>
          </div>
          {/* end::Toolbar */}
        </div>
        {/* end::Post */}

        {/* begin::Separator */}
        <div className='separator mb-4'></div>
        {/* end::Separator */}

        {/* begin::Reply input */}
        <form className='position-relative mb-6'>
          <textarea
            className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
            rows={1}
            placeholder='Reply..'
          ></textarea>

          <div className='position-absolute top-0 end-0 me-n5'>
            <span className='btn btn-icon btn-sm btn-active-color-primary pe-0 me-2'>
              <KTIcon iconName='send' className='fs-3 mb-3' />
            </span>
          </div>
        </form>
        {/* edit::Reply input */}
      </div>
      {/* end::Body */}
    </div>
  )
}
