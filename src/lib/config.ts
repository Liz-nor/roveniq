export const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
export const AUTH_URL = 'https://v2.api.noroff.dev/auth';

// The API only accepts publicly reachable image URLs. On localhost we point at
// the same files in the GitHub repo; once deployed we use the site's own origin.
const GITHUB_PUBLIC_URL = 'https://raw.githubusercontent.com/Liz-nor/roveniq/main/public';

export function publicImageUrl(path: string): string {
    const { hostname, origin } = window.location;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    return `${isLocal ? GITHUB_PUBLIC_URL : origin}${path}`;
}
