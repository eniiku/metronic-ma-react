import { Routes, Route, Outlet, useParams } from 'react-router-dom'
import { ProfileHeaderCustom } from './profile/ProfileHeaderCustom'
import TradeLogCustom from './profile/TradeLogCustom'
import PerformanceCustom from './profile/PerformanceCustom'
import UserWallPostCustom from './profile/UserWallPostCustom'
import ProfileCustom from './profile/ProfileCustom'
// import custom components

const ProfilePageCustom = () => {
  const { userId } = useParams()
  console.log(userId)

  return (
    <Routes>
      <Route
        element={
          <>
            <ProfileHeaderCustom />
            <Outlet />
          </>
        }
      >
        <Route index element={<ProfileCustom />} />
        <Route path='log' element={<TradeLogCustom />} />
        <Route path='performance' element={<PerformanceCustom />} />
        <Route path='wall-post' element={<UserWallPostCustom />} />
      </Route>
    </Routes>
  )
}

export default ProfilePageCustom
