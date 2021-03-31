# Global Posts State + Delete

- Posts are placed into a global store via a provider
- The provider handles all of the fetching now and the hooks merely consume the context from that global state
- However, we're calling `refetch` inside usePosts to make sure the component calling usePosts are getting the most recent data from the data source.
- This causes duplicated requests from components even if they are rendered at the same time.
