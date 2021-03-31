import React from 'react'
import axios from 'axios'

const context = React.createContext()

export function PostsContext({ children }) {
  const [posts, setPosts] = React.useState([])
  const [error, setError] = React.useState()
  const [status, setStatus] = React.useState('loading')

  // create ref to track the Promise of the outgoing request
  const activePromiseRef = React.useRef(false)

  const refetch = () => {
    // only make request when there's no pending Promise
    if (!activePromiseRef.current) {
      activePromiseRef.current = (async () => {
        try {
          setStatus('loading')
          const posts = await axios.get('/api/posts').then((res) => res.data)
          setPosts(posts)
          setError()
          setStatus('success')
        } catch (err) {
          setError(err)
          setStatus('error')
        } finally {
          activePromiseRef.current = false
        }
      })()
    }

    // If there's a pending Promise, use that one
    // If we're dealing with multiple endpoint, we will need request id to do this.
    return activePromiseRef.current
  }

  const contextValue = React.useMemo(() => ({
    posts,
    status,
    error,
    refetch,
  }))

  return <context.Provider value={contextValue}>{children}</context.Provider>
}

export default function usePosts() {
  const { posts, status, error, refetch } = React.useContext(context)

  React.useEffect(() => {
    refetch() // Now all duplicated requests will use the same Promise to resolve
  }, [])

  return {
    posts,
    status,
    error,
    refetch,
  }
}
