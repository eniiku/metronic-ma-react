/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios'
import { getFromCookies } from '../lib/utils'

const api = axios.create({
  // baseURL: 'http://localhost:3100/api',
  baseURL: 'http://localhost:3000/api',
})

const BEARER_TOKEN = getFromCookies()?.api_token as string

export const fetchAllUsers = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/auth/get-all-user-list', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchUserData = async (id: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/auth/get-user-data', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        firebaseUserId: id,
      },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchAllTradeSummary = async (
  filterParams?: object
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      '/trades/get-all-summary-data',
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        params: {
          ...filterParams,
          page: 1,
          limit: 10,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching all trade summary')
  }
}

export const fetchStatistics = async (userId?: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/statistics', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        userId: userId,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching statistics')
  }
}

export const fetchUserTradeSummary = async (id?: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      '/trades/get-user-summary-data',
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        params: {
          user_id: id,
          page: 1,
          limit: 10,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching users trade summary')
  }
}

export const fetchWallPosts = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/wallposts', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        page: 1,
        limit: 10,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching wallposts')
  }
}

export const fetchWallPostsDetails = async (
  wallpostId: string
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(`/wallposts/${wallpostId}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching Wallpost details')
  }
}

export const handleLikeWallPost = async (wallpostId: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      `/wallposts/${wallpostId}/likes/likeUnLikePost`,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Failed to like wall post ')
  }
}

export const fetchCumulativeStats = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/statistics/cumulative-pl', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      // params: {
      //   page: 1,
      //   limit: 10,
      // },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchAdditionalStats = async (userId?: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/statistics/additional', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        userId: userId,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchTradeDirectionStats = async (
  userId?: string
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      '/statistics/trade-direction',
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        params: {
          userId: userId,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchAssetsTradedStats = async (userId: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/statistics/assets-trade', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        user_id: userId,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchFrequentlyTradedStats = async (
  userId?: string
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      '/statistics/frequently-traded-tickers',
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        params: {
          userId: userId,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const postTrades = async (message: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      '/trades/post-trades-data',
      {
        message: message,
        // channelId: 'any',
        // guildId: 'any',
        // discordId: 'any',
        // platform: 'any',
      },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    )
    console.log('API: poat', BEARER_TOKEN)
    return response.data
  } catch (error) {
    throw new Error('Failed to send trade idea')
  }
}

export const fetchNotifications = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/profile/notifications', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const followUser = async (userId: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      '/user/follow',
      { follow_id: userId },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const unFollowUser = async (userId: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      '/user/unfollow',
      { follow_id: userId },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchFollowingUserList = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/user/get-following-users', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}
