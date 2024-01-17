import { FC, useEffect, useState } from 'react'
import { KTIcon } from '../../../helpers'
import { TradeWidgetCustom2 } from './TradeWidgetCustom2'
import { handleLikeWallPost } from '../../../../services/api'
import { useAuth } from '../../../../app/modules/auth'
import { initSocket } from '../../../../services/socket'
import { Link } from 'react-router-dom'

type Props = {
  className: string
  data: any
}

export const FeedsWidgetCustom: FC<Props> = ({ className, data }) => {
  const { currentUser } = useAuth()

  const liked = data?.likes.some(
    (like: any) => like.likedBy._id === currentUser?.id
  )

  const [isLiked, setIsLiked] = useState(liked)
  const [likesCount, setLikesCount] = useState<number>(data?.likesCount || 0)
  const commentsCount = data?.commentsCount || 0

  useEffect(() => {
    const socket = initSocket()

    // Listen for post-liked and post-unliked events
    socket.on('post-liked', (likedData) => {
      // Update the state or refetch data
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

    socket.on('new-post-comment', () => {})

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
          <Link
            to={`user/${data?.author?._id}`}
            className='d-flex align-items-center flex-grow-1'
          >
            {/* begin::Avatar */}
            <div className='symbol symbol-45px me-5'>
              {data?.author?.profilePicture ? (
                <img
                  alt='User profile picture'
                  src={data?.author?.profilePicture}
                />
              ) : (
                <div className='symbol-label fs-1 fw-bold bg-info text-inverse-info'>
                  {data?.author?.username.slice(0, 1)}
                </div>
              )}
            </div>
            {/* end::Avatar */}

            {/* begin::Info */}
            <div className='d-flex flex-column'>
              <div className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                {data?.author.username}
              </div>
            </div>
            {/* end::Info */}
          </Link>
          {/* end::User */}
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
          <div className='text-gray-800 mb-3'>{data?.content}</div>
          {/* end::Text */}

          {/* begin::Ticker mentioned */}
          {data?.tickers && data?.tickers?.length > 0 && (
            <div className='mb-5 fs-9'>
              <span className='text-gray-800'>Ticker(s) Mentioned: </span>
              <span className='text-primary font-bold'>{data?.tickers}</span>
            </div>
          )}
          {/* end::Ticker mentioned */}

          {/* begin:: Custom Trade */}
          {data?.position ? (
            <Link
              className='cursor-pointer'
              to={`/trade/${data?.position?._id}`}
            >
              <TradeWidgetCustom2 className='my-4' data={data?.position} />
            </Link>
          ) : null}
          {/* end:: Custom Trade */}

          {/* begin::Toolbar */}
          <div className='d-flex align-items-center mb-5 justify-content-between'>
            <div>
              <Link
                to={`/wall-post/${data?._id}`}
                className='btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4'
              >
                <KTIcon iconName='message-text-2' className='fs-3' />
                {commentsCount}
              </Link>

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

            <div
              className={`btn btn-sm btn-outline text-uppercase ${
                data?.sentiment === 'bullish'
                  ? 'btn-outline-success'
                  : 'btn-outline-danger'
              }`}
            >
              {data?.sentiment}
            </div>
          </div>
          {/* end::Toolbar */}
        </div>
        {/* end::Post */}
      </div>
      {/* end::Body */}
    </div>
  )
}
