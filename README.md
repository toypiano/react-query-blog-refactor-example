# Dedupe Simultaneous Requests

- Using global state, we can now dedupe requests to the same assets when we use their hooks more than once on the page. This is a useful skill when building server-state management patterns
- We can do this by storing pending Promise inside ref and return it instead of initiating new request.
- In order to track multiple requests to different endpoints, we need unique id per endpoint.
