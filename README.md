# Reusable hooks + Total Post Count

- All of the data fetching hooks are modularized so they can be use throughout the app and a total post count is added to the sidebar
- Unfortunately, the query that powers the total post count does not update when we refetch the same query that powers the posts page
- If we call the custom hook to fetch data inside individual components, we'll end up with a lot of duplicated request for the same data.
