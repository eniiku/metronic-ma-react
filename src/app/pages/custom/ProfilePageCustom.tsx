import { Routes, Route, Outlet, useParams } from 'react-router-dom'
import { ProfileHeaderCustom } from './profile/ProfileHeaderCustom'
import TradeLogCustom from './profile/TradeLogCustom'
import PerformanceCustom from './profile/PerformanceCustom'
import UserWallPostCustom from './profile/UserWallPostCustom'
import ProfileCustom from './profile/ProfileCustom'

const ProfilePageCustom = () => {
  const { userId } = useParams()

  return (
    <Routes>
      <Route
        element={
          <>
            <ProfileHeaderCustom userId={userId ? userId : ''} />
            <Outlet />
          </>
        }
      >
        <Route
          index
          element={<ProfileCustom userId={userId ? userId : ''} />}
        />
        <Route
          path='log'
          element={<TradeLogCustom userId={userId ? userId : ''} />}
        />
        <Route
          path='performance'
          element={<PerformanceCustom userId={userId ? userId : ''} />}
        />
        <Route
          path='wall-post'
          element={<UserWallPostCustom userId={userId ? userId : ''} />}
        />
      </Route>
    </Routes>
  )
}

export default ProfilePageCustom
