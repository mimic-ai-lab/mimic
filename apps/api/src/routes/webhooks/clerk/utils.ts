/**
 * Clerk webhook utility functions for database operations.
 *
 * Handles user synchronization with the database based on Clerk webhook events.
 */
import { FastifyRequest } from 'fastify';
import { UserCreatedSchemaType, UserDeletedSchemaType } from './schema';

/**
 * Handle user.created event
 */
export async function handleUserCreated(request: FastifyRequest, user: UserCreatedSchemaType) {
    try {
        const now = new Date();
        const primaryEmail = user.email_addresses?.[0]?.email_address;

        // Ensure email is provided
        if (!primaryEmail) {
            request.log.error('❌ User created without email address', {
                userId: user.id,
                emailAddresses: user.email_addresses
            });
            throw new Error('Email address is required for user creation');
        }

        const imageUrl = user.image_url || user.profile_image_url || null;
        const lastSignIn = typeof user.last_sign_in_at === 'number' ? new Date(user.last_sign_in_at) : null;

        // Check if user already exists
        const existingUser = await request.pg
            .selectFrom('users')
            .select(['id', 'clerk_id', 'email'])
            .where('clerk_id', '=', user.id)
            .execute();

        if (existingUser.length > 0) {
            request.log.info('👤 User already exists, skipping insert', { userId: user.id });
            return;
        }

        const insertData = {
            clerk_id: user.id,
            email: primaryEmail,
            first_name: user.first_name || null,
            last_name: user.last_name || null,
            image_url: imageUrl,
            created_at: now,
            updated_at: now,
            last_sign_in_at: lastSignIn,
            is_active: true
        };

        request.log.info('💾 Attempting to insert user', { userId: user.id, email: primaryEmail });

        // Use database transaction for atomicity
        const result = await request.pg.transaction().execute(async (trx) => {
            // Check if user already exists within transaction
            const existingUser = await trx
                .selectFrom('users')
                .select(['id', 'clerk_id', 'email'])
                .where('clerk_id', '=', user.id)
                .execute();

            if (existingUser.length > 0) {
                request.log.info('👤 User already exists, skipping insert', { userId: user.id });
                return { action: 'skipped', reason: 'user_exists' };
            }

            if (process.env.NODE_ENV === 'development') {
                request.log.debug('⚡ Executing database insert query');
            }

            const insertResult = await trx
                .insertInto('users')
                .values(insertData as any)
                .returning(['id', 'clerk_id', 'email'])
                .execute();

            if (process.env.NODE_ENV === 'development') {
                request.log.debug('✅ Database insert completed', { result: insertResult });
            }

            return { action: 'created', user: insertResult[0] };
        });

        request.log.info('✅ User created in database', {
            userId: user.id,
            action: result.action,
            dbUserId: result.action === 'created' ? result.user?.id : undefined
        });
    } catch (error) {
        request.log.error('❌ Error creating user in database', {
            userId: user.id,
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            fullError: error,
            errorType: error?.constructor?.name,
            errorCode: (error as any)?.code,
            errorDetail: (error as any)?.detail,
            errorHint: (error as any)?.hint
        });
        throw error;
    }
}

/**
 * Handle user.updated event
 */
export async function handleUserUpdated(request: FastifyRequest, user: UserCreatedSchemaType) {
    try {
        const now = new Date();

        const primaryEmail = user.email_addresses?.[0]?.email_address;

        // Ensure email is provided
        if (!primaryEmail) {
            request.log.error('❌ User updated without email address', {
                userId: user.id,
                emailAddresses: user.email_addresses
            });
            throw new Error('Email address is required for user updates');
        }

        const imageUrl = user.image_url || user.profile_image_url || null;
        const lastSignIn = typeof user.last_sign_in_at === 'number' ? new Date(user.last_sign_in_at) : null;

        const updateData = {
            email: primaryEmail,
            first_name: user.first_name || null,
            last_name: user.last_name || null,
            image_url: imageUrl,
            updated_at: now,
            last_sign_in_at: lastSignIn,
            is_active: true
        };

        request.log.info('Attempting to update user', { clerk_id: user.id, ...updateData });

        await request.pg
            .updateTable('users')
            .set(updateData as any)
            .where('clerk_id', '=', user.id)
            .execute();

        request.log.info('User updated in database', { userId: user.id });
    } catch (error) {
        request.log.error('Error updating user in database', {
            userId: user.id,
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            fullError: error
        });
        throw error;
    }
}

/**
 * Handle user.deleted event
 */
export async function handleUserDeleted(request: FastifyRequest, user: UserDeletedSchemaType) {
    try {
        const now = new Date();
        request.log.info('Starting user deletion process', {
            clerk_id: user.id,
            timestamp: now.toISOString()
        });

        // First check if user exists
        const existingUser = await request.pg
            .selectFrom('users')
            .select(['id', 'clerk_id', 'email'])
            .where('clerk_id', '=', user.id)
            .execute();

        request.log.info('User lookup result', {
            found: existingUser.length > 0,
            userCount: existingUser.length,
            existingUser: existingUser[0] || null
        });

        if (existingUser.length === 0) {
            request.log.warn('User not found for deletion', { clerk_id: user.id });
            return; // Don't throw error, just log and return
        }

        const updateData = {
            updated_at: now,
            is_active: false
        };

        request.log.info('Attempting to soft-delete user', {
            clerk_id: user.id,
            updateData
        });

        await request.pg
            .updateTable('users')
            .set(updateData as any)
            .where('clerk_id', '=', user.id)
            .execute();

        request.log.info('User successfully deleted in database', { userId: user.id });
    } catch (error) {
        request.log.error('Error deleting user in database', {
            userId: user.id,
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            fullError: error,
            errorType: error?.constructor?.name,
            errorCode: (error as any)?.code,
            errorDetail: (error as any)?.detail,
            errorHint: (error as any)?.hint
        });
        throw error;
    }
} 