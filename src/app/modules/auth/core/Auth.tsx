/* eslint-disable react-refresh/only-export-components */
import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import { AuthModel, UserModel } from './_models'
import * as authHelper from './AuthHelpers'
import { getUserByToken } from './_requests'
import { WithChildren } from '../../../../_metronic/helpers'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { saveToCookies } from '../../../../lib/utils'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
}

const firebaseConfig = {
  apiKey: 'AIzaSyB0j8cssvfAxG03GnQuBN53c0NTYSI8dhA',
  authDomain: 'sanguine-sign-305717.firebaseapp.com',
  databaseURL: 'https://sanguine-sign-305717-default-rtdb.firebaseio.com',
  projectId: 'sanguine-sign-305717',
  storageBucket: 'sanguine-sign-305717.appspot.com',
  messagingSenderId: '1070586205990',
  appId: '1:1070586205990:web:ca8c1efa058174277a93e7',
  measurementId: 'G-1597YPH741',
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
      saveToCookies(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider
      value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, currentUser, logout, setCurrentUser } = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async (apiToken: string) => {
      try {
        if (!currentUser) {
          const { data } = await getUserByToken(apiToken)
          if (data) {
            setCurrentUser(data)
          }
        }
      } catch (error) {
        console.error(error)
        if (currentUser) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }
    }

    if (auth && auth.api_token) {
      requestUser(auth.api_token)
    } else {
      logout()
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
