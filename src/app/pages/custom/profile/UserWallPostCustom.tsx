import { useQuery } from 'react-query'
import { fetchWallPosts } from '../../../../services/api'
import { FeedsWidgetCustom } from '../../../../_metronic/partials/widgets/custom/FeedWidgetCustom'
import { Loading } from '../../../components/Loading'
import NoData from '../../../components/NoData'
import { useState } from 'react'

const UserWallPostCustom: React.FC<{ userId: string }> = ({ userId }) => {
  const [page, setPage] = useState(1)
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery('posts', () => fetchWallPosts(page))

  const filteredPosts = posts?.data?.results?.filter(
    (item: any) => item?.author._id === userId
  )
  return (
    <div className='row g-5 g-xxl-8 gap-1 justify-content-center'>
      {isLoading ? (
        <Loading />
      ) : filteredPosts?.length > 0 ? (
        filteredPosts?.map((post: any) => (
          <FeedsWidgetCustom
            key={post._id}
            className='mb-8 col-lg-6'
            data={post}
          />
        ))
      ) : isError ? (
        <NoData type='error' message="Error fetching user's wallpost" />
      ) : (
        <NoData
          type='info'
          message='This user has not created any wall posts.'
        />
      )}
    </div>
  )
}

export default UserWallPostCustom
