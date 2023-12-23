/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios'

const api = axios.create({
  // baseURL: 'https://api.marketaction.net/api',
  baseURL: 'http://localhost:3000/api',
})

const BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTdiNWQ0YThmM2YzODE4MmY1NzhkOWEiLCJlbWFpbCI6Im9sYW1pZG90dW4yMjVAZ21haWwuY29tIiwidWlkIjoiNm9WbHUzT2tXZVVtempqVmJxOXc2cVFqamtSMiIsInVzZXJuYW1lIjpudWxsLCJwcm9maWxlUGljdHVyZSI6bnVsbCwicGhvbmVOdW1iZXIiOm51bGwsImZpcmViYXNlVXNlcklkIjoiNm9WbHUzT2tXZVVtempqVmJxOXc2cVFqamtSMiIsInBsYXRmb3JtIjoiIiwiZmNtVG9rZW4iOiIiLCJpYXQiOjE3MDMzMTcyODIsImV4cCI6MTcwMzkyMjA4Mn0.PrJgeZ9EqJKlngSqrOVc501EZ3sFXLp9byVBb3yyCO0'

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

export const fetchAllTradeSummary = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      '/trades/get-all-summary-data',
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
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchStatistics = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get('/statistics', {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      // params: {
      //   page: 1,
      //   limit: 10,
      // },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}

export const fetchUserTradeSummary = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      '/trades/get-user-summary-data',
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        params: {
          user_id: '657b5d4a8f3f38182f578d9a',
          page: 1,
          limit: 10,
        },
      }
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
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
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
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
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Error fetching users')
  }
}
