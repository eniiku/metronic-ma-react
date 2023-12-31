import { useQuery } from 'react-query'
import { fetchWallPosts } from '../../../../services/api'
import { FeedsWidgetCustom } from '../../../../_metronic/partials/widgets/custom/FeedWidgetCustom'

const UserWallPostCustom: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: posts, isLoading, isError } = useQuery('posts', fetchWallPosts)

  const filteredPosts = posts?.data.results.filter(
    (item: any) => item?.author._id === userId
  )
  return (
    <div className='row g-5 g-xxl-8 gap-1 justify-content-center'>
      {isLoading ? (
        <div>Loading...</div>
      ) : filteredPosts.length > 0 ? (
        filteredPosts.map((post: any) => (
          <FeedsWidgetCustom
            key={post._id}
            className='mb-8 col-lg-6'
            data={post}
          />
        ))
      ) : isError ? (
        <div className='text-center fs-2 py-5'>
          Error fetching user's wallpost
        </div>
      ) : (
        <div className='text-center fs-2 py-5'>
          This user has not created any wall posts.
        </div>
      )}
    </div>
  )
}

export default UserWallPostCustom
