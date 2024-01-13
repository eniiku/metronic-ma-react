/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios'
import { getFromCookies } from '../lib/utils'

const api = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL: 'https://api.marketaction.live/api',
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
    console.log('Error', error)
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
  filterParams?: object,
  page?: number
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
          page: page,
          limit: 10,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching all trade summary')
  }
}

export const fetchTradeSummaryDetails = async (
  summaryId: string
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `/trades/summary/${summaryId}`,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching  trade summary details')
  }
}

export const fetchStatistics = async (
  userId?: string,
  startDate?: string,
  endDate?: string
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/statistics', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        startDate: startDate,
        endDate: endDate,
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
      {},
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error in like/unlike:', error)
    throw new Error('Error fetching Wallpost details')
  }
}

export const handleWallpostComments = async (
  wallpostId: string,
  comment: { image: string; content: string }
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      `/wallposts/${wallpostId}/comments`,
      {
        image: comment.image,
        content: comment.content,
      },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Failed to comment on wallpost:', error)
    throw new Error('Error fetching Wallpost details')
  }
}

export const fetchWallpostComments = async (
  wallpostId: string
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `/wallposts/${wallpostId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        params: {
          page: 1,
          limit: 10,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Failed to comment on wallpost:', error)
    throw new Error('Error fetching Wallpost details')
  }
}

export const fetchCumulativeStats = async (userId: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/statistics/cumulative-pl', {
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

export const fetchAvgRiskStats = async (userId: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/statistics/average-risk', {
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

export const postTrades = async (message: string, id: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      '/trades/post-trades-data',
      {
        message: message,
        user_id: id,
        channelId: 'any',
        guildId: 'any',
        discordId: 'any',
        platform: 'web',
      },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
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

export const handleDeleteAllNotifications = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      '/profile/notifications/deleteAll',
      {},
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

export const postWallpost = async (message: {
  content: string
  image: any
  position: any
  sentiment: 'bearish' | 'bullish' | 'any'
}): Promise<any> => {
  try {
    // Create FormData object
    const formData = new FormData()
    formData.append('content', message.content)
    formData.append('image', message.image)
    formData.append('position', message.position)
    formData.append('sentiment', message.sentiment)

    // Make the POST request with FormData
    const response: AxiosResponse = await api.post('/wallposts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })

    return response.data
  } catch (error) {
    throw new Error('Error posting wallpost')
  }
}

export const fetchNotificationsSettings = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      '/profile/notifications/settings',
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

export const updateNotificationsSettings = async (
  message: object
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      '/profile/notifications/settings',
      message,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error updating notifications settings')
  }
}

export const fetchMarketPrice = async (
  equityType: string,
  ticker: string
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      '/trades/get-current-market-price',
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        params: {
          equity_type: equityType,
          ticker: ticker,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const updateUserData = async (message: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      '/auth/update-user-data',
      { message },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error updating user data')
  }
}

export const fetchFollowers = async (id: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/user/get-followers', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        userId: id,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchFollowingUsers = async (id: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/user/get-following-users', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        userId: id,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}
