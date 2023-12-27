import { Routes, Route, Outlet } from 'react-router-dom'
import { ProfileHeader } from './ProfileHeader'
// import custom components
import TradeLog from './components/custom/TradeLog'
import Performance from './components/custom/Performance'
import Profile from './components/custom/Profile'
import UserWallPost from './components/custom/UserWallPost'

const ProfilePage = () => (
  <Routes>
    <Route
      element={
        <>
          <ProfileHeader />
          <Outlet />
        </>
      }
    >
      <Route index element={<Profile />} />
      <Route path='log' element={<TradeLog />} />
      <Route path='performance' element={<Performance />} />
      <Route path='wall-post' element={<UserWallPost />} />
    </Route>
  </Routes>
)

export default ProfilePage
