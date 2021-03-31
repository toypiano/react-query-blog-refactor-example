import React from 'react'

import { Wrapper, Sidebar, Main } from '../components/styled'
import PostForm from '../components/PostForm'

import usePosts, { PostsContext } from '../hooks/usePosts'
import usePost from '../hooks/usePost'
import useCreatePost from '../hooks/useCreatePost'
import useSavePost from '../hooks/useSavePost'
import useDeletePost from '../hooks/useDeletePost'

function App() {
  const [activePostId, setActivePostId] = React.useState()

  return (
    <PostsContext>
      <Wrapper>
        <Sidebar>
          <a href="#" onClick={() => setActivePostId()}>
            All Posts
          </a>
          <hr />
          <Stats setActivePostId={setActivePostId} />
        </Sidebar>
        <Main>
          {activePostId ? (
            <Post
              activePostId={activePostId}
              setActivePostId={setActivePostId}
            />
          ) : (
            <Posts setActivePostId={setActivePostId} />
          )}
        </Main>
      </Wrapper>
    </PostsContext>
  )
}

function Posts({ setActivePostId }) {
  const { status, posts, error, refetch } = usePosts()
  const [createPost, createPostStatus] = useCreatePost()

  const onSubmit = async (values) => {
    try {
      await createPost(values)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <section>
      <div>
        <h3>Posts</h3>
        <div>
          {status === 'loading' ? (
            <span>Loading...</span>
          ) : status === 'error' ? (
            <span>Error: {error.message}</span>
          ) : (
            <div>
              {posts.map((post) => (
                <div key={post.id}>
                  <a href="#" onClick={() => setActivePostId(post.id)}>
                    {post.title}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <hr />
      <div>
        <h3>Create New Post</h3>
        <div>
          <PostForm
            onSubmit={onSubmit}
            submitText={
              createPostStatus === 'loading'
                ? 'Saving...'
                : createPostStatus === 'error'
                ? 'Error!'
                : createPostStatus === 'success'
                ? 'Saved!'
                : 'Create Post'
            }
          />
        </div>
      </div>
    </section>
  )
}

function Post({ activePostId, setActivePostId }) {
  const { status, post, error, refetch } = usePost(activePostId)
  const [savePost, savePostStatus] = useSavePost()
  const [deletePost, deletePostStatus] = useDeletePost()

  const onSubmit = async (values) => {
    try {
      // this triggers Post and all its descendants to re-render,
      // but other components that display post will not get re-rendered automatically
      // unless you call refetch() from that component.
      await savePost(values)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  const onDelete = async () => {
    if (post.id) {
      try {
        await deletePost(post.id)
        setActivePostId()
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <>
      {status === 'loading' ? (
        <span>Loading...</span>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <div>
          <h3>{post.title}</h3>
          {/* Now display post id */}
          <small>{post.id}</small>
          <div>
            <p>Post ID: {post.content}</p>
          </div>

          <hr />

          <PostForm
            initialValues={post}
            onSubmit={onSubmit}
            submitText={
              savePostStatus === 'loading'
                ? 'Saving...'
                : savePostStatus === 'error'
                ? 'Error!'
                : savePostStatus === 'success'
                ? 'Saved!'
                : 'Update Post'
            }
          />

          <br />

          <button onClick={onDelete}>
            {deletePostStatus === 'loading' ? '...' : 'Delete Post'}
          </button>
        </div>
      )}
    </>
  )
}

function Stats({ setActivePostId }) {
  const { posts, status: postsStatus } = usePosts() // get all posts
  const [postId, setPostId] = React.useState()
  const { post, status: postStatus, error: postError } = usePost(postId) // get post by id

  return (
    <div>
      <div>Total Posts: {postsStatus === 'loading' ? '...' : posts.length}</div>
      <hr />
      <div>
        <div>
          Search Post ID: {/* request will be made on every change */}
          <input value={postId} onChange={(e) => setPostId(e.target.value)} />
        </div>
        <br />
        {postId ? (
          <div>
            {postStatus === 'loading' ? (
              <span>Loading...</span>
            ) : postStatus === 'error' ? (
              // Optional chaining to prevent undefined error
              // When user is typing fast, postError might become undefined before <span> has time to unmount.
              <span>Error: {postError?.message}</span>
            ) : (
              <div>
                <small>Found:</small>
                <br />
                <a href="#" onClick={() => setActivePostId(post.id)}>
                  {post.title}
                </a>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App
