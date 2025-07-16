// Simple auth utilities for now - we'll integrate Better Auth later
export interface User {
    id: string;
    email: string;
    name: string;
    organisation?: string;
}

export interface SignupData {
    name: string;
    organisation: string;
    email: string;
}

export interface SocialAuthData {
    provider: 'github' | 'google';
    code?: string;
    accessToken?: string;
}

export async function signup(data: SignupData): Promise<User | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }

        return await response.json();
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
}

export async function signinWithSocial(data: SocialAuthData): Promise<User | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/social`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Social authentication failed');
        }

        return await response.json();
    } catch (error) {
        console.error("Social auth error:", error);
        throw error;
    }
}

export async function initiateSocialAuth(provider: 'github' | 'google'): Promise<void> {
    const authUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/${provider}`;
    window.location.href = authUrl;
}

export async function signin(email: string, password?: string): Promise<User | null> {
    try {
        const body = password ? { email, password } : { email };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signin failed');
        }

        return await response.json();
    } catch (error) {
        console.error("Signin error:", error);
        throw error;
    }
}

export async function sendMagicLink(email: string): Promise<void> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/magic-link`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send magic link');
        }
    } catch (error) {
        console.error("Magic link error:", error);
        throw error;
    }
}

export async function signout(): Promise<void> {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/signout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Signout error:", error);
    }
} 