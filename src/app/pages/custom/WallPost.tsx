import { useQuery } from 'react-query'
import { fetchWallPosts } from '../../../services/api'
import { FeedsWidgetCustom } from '../../../_metronic/partials/widgets/custom/FeedWidgetCustom'
import { useEffect, useState } from 'react'
import { ToolbarWallpostCustom } from '../../../_metronic/layout/components/toolbar/toolbars/ToolbarWallpostCustom'

const WallPost = () => {
  const { data: posts, isLoading, isError } = useQuery('posts', fetchWallPosts)

  const [wallpostData, setWallpostData] = useState<any>(posts)

  useEffect(() => {
    setWallpostData(posts)
  }, [posts])

  return (
    <>
      <ToolbarWallpostCustom action={setWallpostData} />

      <div className='row g-5 g-xxl-8 gap-1 justify-content-center'>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading wallposts</div>
        ) : wallpostData?.data?.results.length > 0 ? (
          wallpostData?.data?.results.map((post: any) => (
            <FeedsWidgetCustom
              key={post._id}
              className='mb-8 col-lg-6'
              data={post}
            />
          ))
        ) : (
          <div>No posts to show</div>
        )}
      </div>
    </>
  )
}

export default WallPost
