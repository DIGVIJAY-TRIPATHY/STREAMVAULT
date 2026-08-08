// Centralized permission checks. Right now every "can" check just comes
// down to "are you logged in", but keeping them as named functions here
// (instead of inlining `isAuthenticated` checks everywhere) means adding
// something like admin roles or a premium tier later only means editing
// this file, not hunting through every component that gates a feature.

export function canWatch() {
    // Anyone can watch - videos are public, like YouTube.
    return true;
}

export function canSearch() {
    return true;
}

export function canLike(isAuthenticated) {
    return Boolean(isAuthenticated);
}

export function canComment(isAuthenticated) {
    return Boolean(isAuthenticated);
}

export function canSubscribe(isAuthenticated) {
    return Boolean(isAuthenticated);
}

export function canUpload(isAuthenticated) {
    return Boolean(isAuthenticated);
}

export function canCreatePlaylist(isAuthenticated) {
    return Boolean(isAuthenticated);
}