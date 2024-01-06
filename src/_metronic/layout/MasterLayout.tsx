import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { HeaderWrapper } from './components/header'
// import { RightToolbar } from '../partials/layout/RightToolbar'
import { ScrollTop } from './components/scroll-top'
import { Content } from './components/content'
import { FooterWrapper } from './components/footer'
// import { Sidebar } from './components/sidebar'
import { DrawerMessenger, InviteUsers, UpgradePlan } from '../partials'
import { PageDataProvider } from './core'
import { reInitMenu } from '../helpers'
import { ActivityDrawerCustom } from '../partials/layout/activity-drawer/ActivityDrawerCustom'
// import { ToolbarWrapper } from './components/toolbar'

const MasterLayout = () => {
  const location = useLocation()
  useEffect(() => {
    reInitMenu()
  }, [location.key])

  return (
    <PageDataProvider>
      <div className='d-flex flex-column flex-root app-root' id='kt_app_root'>
        <div
          className='app-page flex-column flex-column-fluid'
          id='kt_app_page'
        >
          <HeaderWrapper />
          <div className='flex-column flex-row-fluid' id='kt_app_wrapper'>
            {/* <Sidebar /> */}
            <div
              className='app-main flex-column flex-row-fluid'
              id='kt_app_main'
            >
              <div className='d-flex flex-column flex-column-fluid'>
                {/* <ToolbarWrapper /> */}
                <Content>
                  <Outlet />
                </Content>
              </div>
            </div>
          </div>
          <FooterWrapper />
        </div>
      </div>

      {/* begin:: Drawers */}
      <ActivityDrawerCustom />
      {/*
      -- Uncomment this to enable the right toolbar (Help & Buy Now modals)
      <RightToolbar /> */}
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  )
}

export { MasterLayout }
