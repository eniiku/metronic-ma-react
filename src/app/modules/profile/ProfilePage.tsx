import { Routes, Route, Outlet } from 'react-router-dom'
import { ProfileHeader } from './ProfileHeader'
// import custom components
import { useAuth } from '../auth'
import TradeLogCustom from '../../pages/custom/profile/TradeLogCustom'
import UserWallPostCustom from '../../pages/custom/profile/UserWallPostCustom'
import PerformanceCustom from '../../pages/custom/profile/PerformanceCustom'
import ProfileCustom from '../../pages/custom/profile/ProfileCustom'

const ProfilePage = () => {
  const { currentUser } = useAuth()

  return (
    <Routes>
      <Route
        element={
          <>
            <ProfileHeader />
            <Outlet />
          </>
        }
      >
        <Route
          index
          element={
            <ProfileCustom userId={currentUser ? `${currentUser.id}` : ''} />
          }
        />
        <Route
          path='log'
          element={
            <TradeLogCustom userId={currentUser ? `${currentUser.id}` : ''} />
          }
        />
        <Route
          path='performance'
          element={
            <PerformanceCustom
              userId={currentUser ? `${currentUser.id}` : ''}
            />
          }
        />
        <Route
          path='wall-post'
          element={
            <UserWallPostCustom
              userId={currentUser ? `${currentUser.id}` : ''}
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default ProfilePage
