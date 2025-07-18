/**
 * Email service configuration and utilities.
 *
 * Provides centralized email functionality using Resend for sending
 * transactional emails like magic links, notifications, etc.
 */
import { Resend } from "resend";

/**
 * Email service interface for sending emails.
 */
export interface EmailService {
    /**
     * Send an email using the configured email provider.
     * 
     * @param options - Email sending options
     * @returns Promise that resolves when email is sent
     */
    sendEmail(options: {
        to: string;
        from: string;
        subject: string;
        html: string;
    }): Promise<void>;
}

/**
 * Resend email service implementation.
 * 
 * Provides email sending functionality using Resend's API.
 * Falls back gracefully if Resend is not configured.
 */
class ResendEmailService implements EmailService {
    private resend: Resend | null;

    constructor() {
        this.resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    }

    /**
     * Send an email using Resend.
     * 
     * @param options - Email sending options
     * @throws {Error} If email sending fails
     */
    async sendEmail(options: {
        to: string;
        from: string;
        subject: string;
        html: string;
    }): Promise<void> {
        if (!this.resend) {
            console.warn("Resend not configured, skipping email send");
            return;
        }

        try {
            await this.resend.emails.send(options);
        } catch (error) {
            console.error("Failed to send email:", error);
            throw new Error("Failed to send email");
        }
    }

    /**
     * Check if the email service is properly configured.
     * 
     * @returns {boolean} True if Resend is configured
     */
    isConfigured(): boolean {
        return this.resend !== null;
    }
}

/**
 * Global email service instance.
 */
const emailService = new ResendEmailService();

/**
 * Get the email service instance.
 * 
 * @returns {EmailService} The configured email service
 */
export function getEmailService(): EmailService {
    return emailService;
}

/**
 * Check if email service is configured.
 * 
 * @returns {boolean} True if email service is available
 */
export function isEmailConfigured(): boolean {
    return emailService.isConfigured();
}

/**
 * Send a magic link email.
 * 
 * Convenience function for sending magic link authentication emails
 * with a pre-configured template.
 * 
 * @param email - Recipient email address
 * @param url - Magic link URL
 * @returns Promise that resolves when email is sent
 */
export async function sendMagicLinkEmail(email: string, url: string): Promise<void> {
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (!fromEmail) {
        throw new Error("RESEND_FROM_EMAIL environment variable is required");
    }

    try {
        await emailService.sendEmail({
            from: fromEmail,
            to: email,
            subject: "Sign in to Mimic",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Mimic!</h2>
                    <p>Click the button below to sign in to your account:</p>
                    <a href="${url}" 
                       style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                        Sign In
                    </a>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't request this email, you can safely ignore it.
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        This link will expire in 5 minutes.
                    </p>
                </div>
            `,
        });
    } catch (error) {
        console.error('Failed to send magic link email to:', email, error);
        throw error;
    }
} 