import { Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Overview } from './components/Overview'
import { Projects } from './components/Projects'
import { Campaigns } from './components/Campaigns'
import { Documents } from './components/Documents'
// import { Connections } from './components/Connections'
import { ProfileHeader } from './ProfileHeader'
import TradeLog from '../auth/components/TradeLog'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/crafted/pages/profile/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

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
      <Route
        index
        element={
          <>
            <Overview />
          </>
        }
      />
      <Route
        path='log'
        element={
          // <>
          <TradeLog />
          // </>
        }
      />
      <Route
        path='performance'
        element={
          <>
            <Campaigns />
          </>
        }
      />
      <Route
        path='wall-post'
        element={
          <>
            <Documents />
          </>
        }
      />
    </Route>
  </Routes>
)

export default ProfilePage
