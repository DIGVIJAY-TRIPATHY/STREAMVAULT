// Holds a single "do this after you log in" callback. This is deliberately
// NOT stored in Redux, since callbacks aren't serializable. It works fine
// as a plain module-level variable because the redirect to /login is a
// client-side React Router navigation, not a full page reload - the JS
// module (and this closure) stays alive the whole time.
let pendingAction = null;

/**
 * Stash a callback to run automatically once the user is authenticated.
 * Pass null/undefined to clear without running anything.
 */
export function setPendingAction(fn) {
    pendingAction = typeof fn === "function" ? fn : null;
}

/**
 * Retrieve and clear the stashed callback (one-shot - it only ever runs once).
 * Returns null if nothing is pending.
 */
export function consumePendingAction() {
    const action = pendingAction;
    pendingAction = null;
    return action;
}