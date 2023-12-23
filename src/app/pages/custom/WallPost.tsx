import { useQuery } from 'react-query'
import { fetchWallPosts } from '../../../services/api'
import { FeedsWidgetCustom } from '../../../_metronic/partials/widgets/custom/FeedWidgetCustom'

const WallPost = () => {
  const { data: posts, isLoading } = useQuery('posts', fetchWallPosts)
  return (
    <div className='row g-5 g-xxl-8 gap-1 justify-content-center'>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        posts.data.results.map((post: any) => (
          <FeedsWidgetCustom
            key={post._id}
            className='mb-8 col-lg-6'
            data={post}
          />
        ))
      )}
    </div>
  )
}

export default WallPost
