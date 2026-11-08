import { AUTH_URL } from '../lib/config';
import type { AuthUser, Media } from '../lib/authStore';

interface LoginResponse {
    data: AuthUser & { accessToken: string };
}

interface RegisterResponse {
    data: AuthUser;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    venueManager?: boolean;
    avatar?: Media;
    banner?: Media;
}

interface ApiError {
    errors?: { message: string }[];
}

async function postAuth<T>(path: string, body: unknown, fallbackError: string): Promise<T> {
    const response = await fetch(`${AUTH_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok || !json) {
        const message = (json as ApiError | null)?.errors?.[0]?.message;
        throw new Error(message ?? fallbackError);
    }
    return json as T;
}

export async function login(email: string, password: string) {
    // _holidaze=true makes the response include venueManager.
    const json = await postAuth<LoginResponse>(
        '/login?_holidaze=true',
        { email, password },
        'Failed to log in',
    );
    const { accessToken, ...user } = json.data;
    return { user, accessToken };
}

export async function register(request: RegisterRequest): Promise<AuthUser> {
    const json = await postAuth<RegisterResponse>('/register', request, 'Registration failed');
    return json.data;
}
