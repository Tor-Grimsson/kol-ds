/**
 * RouteLoader — intentionally empty.
 *
 * Previously rendered a 500ms full-screen spinner on every route change.
 * No route in this app needs a blind timer overlay — components that
 * depend on async data handle their own loading states.
 *
 * Kept as a no-op export so App.jsx doesn't need a diff.
 */
const RouteLoader = () => null

export default RouteLoader
