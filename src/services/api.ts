/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3100/api',
})

const BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTg1YjU4M2JkZDk0MjYyYjM2ZTM3Y2MiLCJ1c2VybmFtZSI6ImRlbW8tMiIsImVtYWlsIjoidGhpc2lzYWRlbW9AZ21haWwuY29tIiwiaWF0IjoxNzAzMjYxNTcxLCJleHAiOjE3MDM4NjYzNzF9.DwKABOmOpURxmieqTBh9BN46Ak6umYLVMTf286CRMoU'

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
