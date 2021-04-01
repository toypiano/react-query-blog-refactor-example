import axios from 'axios'
import { useMutation, queryCache } from 'react-query'

export default function useSavePost() {
  // mutations perform server side-effects like create/update/delete
  // returns [mutationFn, { status, isIdle, isLoading, isSuccess, isError, data, error, reset }]
  return useMutation(
    // This mutationFn will be returned when useSavePost is called.
    (values) =>
      axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      // Fired before mutation function with the same variable passed to it.
      // onMutate is used to save cached query and use it inside the rollback function.
      onMutate: (values) => {
        const previousPost = queryCache.getQueryData(['post', values.id])

        // Immediately update query's cached data. Stale data can only live up to 5 minutes.
        queryCache.setQueryData(['post', values.id], (old) => ({
          ...old,
          ...values,
        }))

        // This rollback function is passed to onError and onSettled as 3rd argument.
        return () => queryCache.setQueryData(['post', values.id], previousPost)
      },
      // onError(err, variables, onMutateValue)
      onError: (error, values, rollback) => rollback(),
      // onSuccess(data, variables)
      onSuccess: async (values) => {
        // Refetch 'posts' query to reflect the mutation and trigger re-rendering of all component depending on that  query
        queryCache.refetchQueries('posts')
        // Refetch only the mutated post to trigger re-rendering of that Post.
        await queryCache.refetchQueries(['post', values.id])
      },
    }
  )
}
