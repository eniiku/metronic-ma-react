import { useQuery } from 'react-query'
import { fetchWallPosts } from '../../../../../services/api'
import { FeedsWidgetCustom } from '../../../../../_metronic/partials/widgets/custom/FeedWidgetCustom'
import { useAuth } from '../../../auth'

const UserWallPost = () => {
  const { data: posts, isLoading, isError } = useQuery('posts', fetchWallPosts)

  const { currentUser } = useAuth()

  const user = currentUser?.username

  const filteredPosts = posts?.data.results.filter(
    (item: any) => item?.author.username === user
  )

  console.log(filteredPosts)
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
        <div>Error fetching user wallpost</div>
      ) : (
        <div className='text-center fs-2 py-5'>
          You have not created any wall posts.
        </div>
      )}
    </div>
  )
}

export default UserWallPost
