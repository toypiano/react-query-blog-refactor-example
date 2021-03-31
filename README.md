# Migrate queries to React Query

- By moving all of the queries to React Query, we not only get to remove a TON of code we were using to track our server-state, but we also get a ton of great stuff we didn't have before like caching, background refetching and loading states and automatic refetching of stale data
- At this point, we are much better off, but it could be better! We still have to manually refetch our queries where they are used to get them to updated when we make a change on the server with a mutation
