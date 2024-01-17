import { useQuery } from 'react-query'
import { fetchWallPosts } from '../../../services/api'
import { FeedsWidgetCustom } from '../../../_metronic/partials/widgets/custom/FeedWidgetCustom'
import { useEffect, useState } from 'react'
import { ToolbarWallpostCustom } from '../../../_metronic/layout/components/toolbar/toolbars/ToolbarWallpostCustom'
import { Loading } from '../../components/Loading'
import NoData from '../../components/NoData'
import { RotatingLines } from 'react-loader-spinner'

const WallPost = () => {
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const {
    data: newPosts,
    isLoading,
    isError,
  } = useQuery(['newPosts', page], () => fetchWallPosts(page))

  const [wallpostData, setWallpostData] = useState<any>({
    data: { results: [] },
  })

  useEffect(() => {
    setWallpostData((prevData: any) => ({
      data: {
        results: [...prevData.data.results],
      },
    }))
  }, [])

  useEffect(() => {
    if (newPosts) {
      setWallpostData((prevData: any) => ({
        data: {
          results: [...prevData.data.results, ...newPosts.data.results],
        },
      }))
      setLoadingMore(false)
    }
  }, [newPosts])

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loadingMore &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200
      ) {
        // Reached the bottom of the page, load more posts
        if (page < parseInt((newPosts?.data?.totalRecords / 10).toFixed(0))) {
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
    <>
      <ToolbarWallpostCustom action={setWallpostData} />

      <div className='row g-5 g-xxl-8 gap-1 justify-content-center'>
        {
          // isLoading ? (
          //   <Loading />
          // ) :
          isError ? (
            <NoData type='error' message='Error Loading Wallposts' />
          ) : wallpostData?.data?.results.length > 0 ? (
            wallpostData?.data?.results.map((post: any, index: number) => (
              <FeedsWidgetCustom
                key={`${post._id}_${index}`}
                className='mb-8 col-lg-6'
                data={post}
              />
            ))
          ) : (
            <NoData type='info' message='No posts to show' />
          )
        }
        {loadingMore && (
          <div className='text-center'>
            <RotatingLines
              visible={true}
              width='30'
              strokeColor='gray'
              strokeWidth='5'
              animationDuration='0.75'
              ariaLabel='rotating-lines-loading'
            />
          </div>
        )}
      </div>
    </>
  )
}

export default WallPost
