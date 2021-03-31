# Basic Blog App + API

- This is the initial commit with a base Next.js application.
- It provides an API for CRUD-ind blog posts and its storage is in-memory, so it will be wiped clean every time a file is edited.
- A basic client application is set up using local component state to fetch, display, and modify the posts on the backend.

## Data Fetching Strategy

- Fetch data inside `useEffect()`
- `useState` for keeping track of data, loading state and network error.
- Components will initiate fetch on mount.
- Rendering is
