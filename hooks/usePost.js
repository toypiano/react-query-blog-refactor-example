import React from 'react'
import axios from 'axios'

const context = React.createContext()

export function PostContext({ children }) {
  // posts is an object that maps postId to its post
  const [posts, setPosts] = React.useState({})
  const activePromisesRef = React.useRef({})

  // setPost adds new post to the posts object
  const setPost = React.useCallback(
    (id, updater) =>
      setPosts((old) => ({
        ...old,
        // if updater is a function, call it to set the value of [id]
        // if updater is a function but id doesn't exist, pass an empty object to updater
        // if updater is not a function, set it as the value of [id]
        [id]: typeof updater === 'function' ? updater(old[id] || {}) : updater,
      })),
    [setPosts]
  )

  const refetch = React.useCallback(
    async (postId) => {
      if (!postId) {
        return
      }
      // Store multiple request Promises into a ref to track their states
      if (!activePromisesRef.current[postId]) {
        activePromisesRef.current[postId] = (async () => {
          try {
            // We are adding loading status, error object, and post data to the post object
            setPost(postId, (old) => ({
              ...old, // this way, we can modify or add to the existing post properties
              status: 'loading',
            }))

            const post = await axios
              .get(`/api/posts/${postId}`)
              .then((res) => res.data)

            setPost(postId, (old) => ({
              ...old,
              status: 'success',
              error: undefined,
              data: post,
            }))
          } catch (err) {
            setPost(postId, (old) => ({
              ...old,
              status: 'error',
              error: err,
            }))
          } finally {
            // remove resolved Promise from the ref
            activePromisesRef.current[postId] = false
          }
        })()
      }

      // If the Promise identified by its postId still exists inside the ref,
      // just return that promise instead of making duplicated request.
      return activePromisesRef.current[postId]
    },
    [setPost]
  )

  const contextValue = React.useMemo(() => ({
    posts,
    refetch,
  }))

  // Now we have posts as the global state and we can use `refetch` to fetch individual post by postId.
  // Server state including loading state and error now lives in individual post object
  return <context.Provider value={contextValue}>{children}</context.Provider>
}

// now usePost only refers to the global state that keeps track of individual post state
export default function usePost(postId) {
  // useContext triggers re-render even with memoized value passed to the Provider.
  const { posts, refetch: refetchById } = React.useContext(context)

  const { data: post, status, error } = posts[postId] || { status: 'loading' }

  const refetch = React.useCallback(async () => refetchById(postId), [
    refetchById,
    postId,
  ])

  React.useEffect(() => {
    refetch()
  }, [refetch])

  return {
    post,
    status,
    error,
    refetch,
  }
}
