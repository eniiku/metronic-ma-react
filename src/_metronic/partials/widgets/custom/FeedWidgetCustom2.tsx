import { FC, useEffect, useState } from 'react'
import { KTIcon } from '../../../helpers'
import { TradeWidgetCustom2 } from './TradeWidgetCustom2'
import {
  handleLikeWallPost,
  handleWallpostComments,
} from '../../../../services/api'
import { useAuth } from '../../../../app/modules/auth'
import { initSocket } from '../../../../services/socket'
import { Link } from 'react-router-dom'

type Props = {
  className: string
  data: any
}

export const FeedsWidgetCustom2: FC<Props> = ({ className, data }) => {
  const { currentUser } = useAuth()

  const liked = data?.likes.some(
    (like: any) => like.likedBy._id === currentUser?.id
  )

  const [isLiked, setIsLiked] = useState(liked)
  const [likesCount, setLikesCount] = useState<number>(data?.likesCount || 0)
  const [commentData, setCommentData] = useState<any>(data?.comments || [])
  const [commentsCount, setCommentsCount] = useState<number>(
    data?.commentsCount || 0
  )
  const [commentContent, setCommentContent] = useState('')

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

  const handleCommentSubmit = async (e: any) => {
    e.preventDefault()

    try {
      // Optimistically update the local state with the new comment
      const newComment = {
        commentedBy: {
          _id: currentUser?.id,
          username: currentUser?.username,
          profilePicture: currentUser?.pic,
        },
        content: commentContent,
      }

      // Simulate a tiny loading time (you can adjust the duration)
      await new Promise((resolve) => setTimeout(resolve, 200))

      setCommentData((prevComments: any) => [newComment, ...prevComments])

      // Increase the comments count
      setCommentsCount((prevCount) => prevCount + 1)

      // Clear input field
      setCommentContent('')

      // Call the API to submit the comment
      await handleWallpostComments(data?._id, {
        image: '', // Add image if needed
        content: commentContent,
      })
    } catch (error) {
      console.error('Error submitting comment:', error)

      // Revert the optimistic update if there's an error
      setCommentData((prevComments: any) =>
        prevComments.slice(0, prevComments.length - 1)
      )

      // Decrease the comments count
      setCommentsCount((prevCount) => Math.max(0, prevCount - 1))
    }
  }

  const handleTextareaKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // Check if the Enter key is pressed
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommentSubmit(e)
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
              <button className='btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4'>
                <KTIcon iconName='message-text-2' className='fs-3' />
                {commentsCount}
              </button>

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

        {/* begin::Replies */}
        <div className='mb-7 ps-15'>
          {commentData.length > 0
            ? commentData.map((comment: any) => (
                <div key={commentData._id} className='d-flex mb-5'>
                  {/* begin::Avatar */}
                  <div className='symbol symbol-45px me-5'>
                    {comment?.commentedBy?.profilePicture ? (
                      <img
                        alt='User profile picture'
                        src={comment?.commentedBy?.profilePicture}
                      />
                    ) : (
                      <div className='symbol-label fs-2 fw-bold bg-info text-inverse-info'>
                        {comment?.commentedBy?.username.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  {/* end::Avatar */}

                  {/* begin::Info */}
                  <div className='d-flex flex-column flex-row-fluid'>
                    {/* begin::Info */}
                    <div className='d-flex align-items-center flex-wrap mb-1'>
                      <a
                        href='#'
                        className='text-gray-800 text-hover-primary fw-bold me-2'
                      >
                        {comment?.commentedBy?.username}
                      </a>

                      <a
                        href='#'
                        className='ms-auto text-gray-500 text-hover-primary fw-semibold fs-7'
                      >
                        Reply
                      </a>
                    </div>
                    {/* end::Info */}

                    {/* begin::Post */}
                    <span className='text-gray-800 fs-7 fw-normal pt-1'>
                      {comment?.content}
                    </span>
                    {/* end::Post */}
                  </div>
                  {/* end::Info */}
                </div>
              )) // {/* end::Reply */
            : null}
        </div>
        {/* end::Replies */}

        {/* begin::Separator */}
        <div className='separator mb-4'></div>
        {/* end::Separator */}

        {/* begin::Reply input */}
        <form
          className='position-sticky bottom-0 mb-6'
          onSubmit={handleCommentSubmit}
        >
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onKeyDown={handleTextareaKeyPress}
            className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
            rows={1}
            placeholder='Reply..'
          ></textarea>

          <div className='position-absolute top-0 end-0 me-n5'>
            <span className='btn btn-icon btn-sm btn-active-color-primary pe-0 me-2'>
              <KTIcon iconName='paper-clip' className='fs-3 mb-3' />
            </span>

            <span
              className='btn btn-icon btn-sm btn-active-color-primary pe-0 me-2'
              onClick={handleCommentSubmit}
            >
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
