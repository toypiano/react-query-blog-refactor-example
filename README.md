# Global Post Detail State

- The individual post context is also globalized into a provider and hooks to consume it. It contains an id-based cache of each individual post and the appropriate state for each one
- At this point, we have accumulated a TON of code simply to manage this global server-state and we still do not have proper caching or invalidation set up, and we still have a lot of loading jank. Overall, the user experience hasn't really changed and we only have more code to worry about now.
