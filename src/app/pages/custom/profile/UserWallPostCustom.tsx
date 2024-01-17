import { useQuery } from 'react-query'
import { fetchWallPosts } from '../../../../services/api'
import { FeedsWidgetCustom } from '../../../../_metronic/partials/widgets/custom/FeedWidgetCustom'
import { Loading } from '../../../components/Loading'
import NoData from '../../../components/NoData'
import { useEffect, useState } from 'react'

const UserWallPostCustom: React.FC<{ userId: string }> = ({ userId }) => {
  const [page, setPage] = useState(1)
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery(['posts', page], () => fetchWallPosts(page))

  const filteredPosts = posts?.data?.results?.filter(
    (item: any) => item?.author._id === userId
  )

  const [loadingMore, setLoadingMore] = useState(false)

  const [filteredPostsData, setFilteredPostsData] = useState<any>({
    data: { results: [] },
  })

  useEffect(() => {
    if (filteredPosts) {
      setFilteredPostsData((prevData: any) => ({
        data: {
          results: [...prevData.data.results, ...filteredPosts.data.results],
        },
      }))
      setLoadingMore(false)
    }
  }, [filteredPosts])

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loadingMore &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200
      ) {
        // Reached the bottom of the page, load more posts
        if (
          page < parseInt((filteredPosts?.data?.totalRecords / 10).toFixed(0))
        ) {
          setPage((prevPage) => prevPage + 1)
          setLoadingMore(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className='row g-5 g-xxl-8 gap-1 justify-content-center'>
      {
        // isLoading ? (
        //   <Loading />
        // ) :
        filteredPostsData?.length > 0 ? (
          filteredPostsData?.map((post: any) => (
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
        )
      }
    </div>
  )
}

export default UserWallPostCustom
