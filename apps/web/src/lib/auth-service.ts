import { authClient } from './auth-client';

/**
 * Custom auth service that handles standardized API responses from our backend.
 * 
 * Better Auth's client doesn't properly handle our backend's standardized error format,
 * so we need to wrap it and extract error messages correctly.
 */
export class AuthService {
    /**
     * Send magic link for authentication (sign in or sign up)
     */
    static async signInWithMagicLink(email: string, callbackURL: string = '/') {
        try {
            const response = await authClient.signIn.magicLink({
                email,
                callbackURL,
            });

            // Check if the response contains an error
            if (response && typeof response === 'object' && 'error' in response) {
                const errorData = response.error;

                // Extract error message from our standardized format
                if (errorData && typeof errorData === 'object' && 'message' in errorData) {
                    throw new Error(errorData.message as string);
                }

                // Fallback error message
                throw new Error('Authentication failed');
            }

            return response;
        } catch (error) {
            // Re-throw the error with proper message
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Authentication failed');
        }
    }

    /**
     * Sign out the current user
     */
    static async signOut() {
        try {
            await authClient.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
            // Don't throw on sign out errors, just log them
        }
    }

    /**
     * Get current session
     */
    static async getSession() {
        try {
            return await authClient.getSession();
        } catch (error) {
            console.error('Get session error:', error);
            return null;
        }
    }
} 