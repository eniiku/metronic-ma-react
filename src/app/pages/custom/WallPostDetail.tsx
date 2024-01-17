import { useParams } from 'react-router-dom'
import { FeedsWidgetCustom2 } from '../../../_metronic/partials/widgets/custom/FeedWidgetCustom2'
import { fetchWallPosts } from '../../../services/api'
import { useQuery } from 'react-query'

const WallPostDetail = () => {
  const { wallPostId } = useParams()

  const { data: wallPosts } = useQuery('wallPosts', () => fetchWallPosts(1))

  const currentWallPost = wallPosts?.data?.results.filter(
    (post: any) => post?._id === wallPostId
  )[0]

  return (
    <div
      className='d-flex align-items-center justify-content-center row'
      style={{ minHeight: '77vh' }}
    >
      <FeedsWidgetCustom2 data={currentWallPost} className='col-6' />
    </div>
  )
}

export default WallPostDetail
