import { useQuery } from 'react-query'
import axios from 'axios'

export default function usePost(postId) {
  // You can pass an array with a string as a query key
  return useQuery(
    postId && ['post', postId],
    // then pass a function that returns a Promise
    () => axios.get(`/api/posts/${postId}`).then((res) => res.data)
  )
  // useQuery returns the following object:
  // {
  //   isLoading: boolean,
  //   isError: boolean,
  //   isIdle: boolean, // will be true until dependent query data is available
  //   status: string,
  //   data: any, // null at first
  //   error: Error,
  //   refetch: function
  // }

  // No more keeping loading states in global state

  // No more de-duping logic

  // No more managing context
}
