import { useQuery } from 'react-query'
import { fetchStatistics, fetchWallPosts } from '../../../../../services/api'
import { TablesWidgetCustom } from '../../../../../_metronic/partials/widgets/custom/TableWidgetCustom'
import { Overview } from '../Overview'
import { ChartsWidget1 } from '../../../../../_metronic/partials/widgets/charts/ChartsWidget1'
import { ListsWidget5 } from '../../../../../_metronic/partials/widgets/lists/ListsWidget5'
import { ListsWidget2 } from '../../../../../_metronic/partials/widgets/lists/ListsWidget2'
import { FeedsWidgetCustom } from '../../../../../_metronic/partials/widgets/custom/FeedWidgetCustom'

const Profile = () => {
  const { data: statistics, isLoading } = useQuery(
    'statistics',
    fetchStatistics
  )

  const { data: posts, isLoading: isLoadingPosts } = useQuery(
    'posts',
    fetchWallPosts
  )
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <TablesWidgetCustom className='mb-8' data={statistics.data} />
      )}
      <div className='row g-5 g-xxl-8'>
        <div className='col-xl-6'>
          {isLoadingPosts ? (
            <div>Loading...</div>
          ) : (
            posts.data.results
              .slice(0, 3)
              .map((post: any) => (
                <FeedsWidgetCustom
                  key={post._id}
                  className='mb-5 mb-xxl-8'
                  data={post}
                />
              ))
          )}
        </div>

        <div className='col-xl-6'>
          <ChartsWidget1 className='mb-5 mb-xxl-8' />

          <ListsWidget5 className='mb-5 mb-xxl-8' />

          {/* <ListsWidget2 className='mb-5 mb-xxl-8' /> */}
        </div>
      </div>
    </>
  )
}

export default Profile
