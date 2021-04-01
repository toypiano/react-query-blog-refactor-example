import { useInfiniteQuery } from 'react-query'
import axios from 'axios'

export default function useInfinitePosts() {
  return useInfiniteQuery(
    'infinitePosts',
    (key, nextPageOffset = 0) =>
      axios
        .get('/api/posts', {
          params: {
            pageSize: 3,
            // pageOffset value will be replaced by lastResult.nextPageOffset from getFetchMore function
            pageOffset: nextPageOffset,
          },
        })
        .then((res) => res.data),
    {
      // This is the only difference between useInfiniteQuery vs useQuery
      // (lastPage, allPages) => fetchMoreVariable | Boolean
      // the return value (nextPageOffset) is passed to the last parameter of query function
      getFetchMore: (lastResult) => lastResult.nextPageOffset,
    }
  )
}
