import React from 'react'
import axios from 'axios'

const context = React.createContext()

export function PostsContext({ children }) {
  const [posts, setPosts] = React.useState([])
  const [error, setError] = React.useState()
  const [status, setStatus] = React.useState('loading')

  const refetch = async () => {
    try {
      setStatus('loading')
      const posts = await axios.get('/api/posts').then((res) => res.data)
      setPosts(posts)
      setError()
      setStatus('success')
    } catch (err) {
      setError(err)
      setStatus('error')
    }
  }

  // https://github.com/kentcdodds/kentcdodds.com/blob/319db97260078ea4c263e75166f05e2cea21ccd1/content/blog/how-to-optimize-your-context-value/index.md
  // prevent children components nested inside Provider from re-rendering when contextValue is updated.
  const contextValue = React.useMemo(() => ({
    posts,
    status,
    error,
    refetch,
  }))
  // Without useMemo(), contextValue will be pointing at new object every time PostContext is re-rendered.
  // This means that every component nested inside the Provider will be re-rendered
  // even if the actual relevant values are unchanged.

  return <context.Provider value={contextValue}>{children}</context.Provider>
}

export default function usePosts() {
  const { posts, status, error, refetch } = React.useContext(context)

  // refetch the data to avoid consuming stale global state
  React.useEffect(() => {
    refetch()
  }, [])

  return {
    posts,
    status,
    error,
    refetch,
  }
}
