#!/usr/bin/env tsx

import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import crypto from 'crypto';

// Database interface for seeding
interface Database {
    teams: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        plan: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    };
    users: {
        id: string;
        clerk_id: string;
        email: string;
        first_name: string | null;
        last_name: string | null;
        image_url: string | null;
        created_at: Date;
        updated_at: Date;
        last_sign_in_at: Date | null;
        is_active: boolean;
    };
    team_api_keys: {
        id: string;
        team_id: string;
        name: string;
        key_hash: string;
        key_prefix: string;
        scope: string;
        created_by: string;
        expires_at: Date | null;
        last_used_at: Date | null;
        created_at: Date;
        updated_at: Date;
        is_active: boolean;
    };
}

async function seedTestData() {
    console.log('🌱 Seeding test data...');

    // Initialize database connection
    const db = new Kysely<Database>({
        dialect: new PostgresDialect({
            pool: new pg.Pool({
                connectionString: process.env.DATABASE_URL,
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            }),
        }),
    });

    try {
        // Create a test team (use upsert to handle existing data)
        console.log('📝 Creating test team...');
        const [team] = await db
            .insertInto('teams')
            .values({
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Test Team',
                slug: 'test-team',
                description: 'Test team for CLI API key testing',
                plan: 'free',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            })
            .onConflict((oc) => oc.column('id').doUpdateSet({
                name: 'Test Team',
                slug: 'test-team',
                description: 'Test team for CLI API key testing',
                updated_at: new Date(),
            }))
            .returningAll()
            .execute();

        console.log('✅ Team created/updated:', team.name);

        // Create a test user (use upsert to handle existing data)
        console.log('👤 Creating test user...');
        const [user] = await db
            .insertInto('users')
            .values({
                id: '550e8400-e29b-41d4-a716-446655440002',
                clerk_id: 'user_test_clerk_id',
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                image_url: null,
                created_at: new Date(),
                updated_at: new Date(),
                last_sign_in_at: null,
                is_active: true,
            })
            .onConflict((oc) => oc.column('id').doUpdateSet({
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                updated_at: new Date(),
            }))
            .returningAll()
            .execute();

        console.log('✅ User created/updated:', user.email);

        // Create a CLI system user for CLI-created resources (use upsert to handle existing data)
        console.log('🤖 Creating CLI system user...');
        const [cliUser] = await db
            .insertInto('users')
            .values({
                id: '550e8400-e29b-41d4-a716-446655440003',
                clerk_id: 'cli_system_user',
                email: 'cli@mimic.ai',
                first_name: 'CLI',
                last_name: 'System',
                image_url: null,
                created_at: new Date(),
                updated_at: new Date(),
                last_sign_in_at: null,
                is_active: true,
            })
            .onConflict((oc) => oc.column('id').doUpdateSet({
                email: 'cli@mimic.ai',
                first_name: 'CLI',
                last_name: 'System',
                updated_at: new Date(),
            }))
            .returningAll()
            .execute();

        console.log('✅ CLI system user created/updated:', cliUser.email);

        // Create a test API key
        console.log('🔑 Creating test API key...');
        const apiKey = 'mk_test_550e8400-e29b-41d4-a716-446655440003';
        const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
        const keyPrefix = apiKey.substring(0, 10);

        const [apiKeyRecord] = await db
            .insertInto('team_api_keys')
            .values({
                id: '550e8400-e29b-41d4-a716-446655440004',
                team_id: team.id,
                name: 'CLI Test Key',
                key_hash: keyHash,
                key_prefix: keyPrefix,
                scope: 'full',
                created_by: user.id,
                expires_at: null, // No expiration for test
                last_used_at: null,
                created_at: new Date(),
                updated_at: new Date(),
                is_active: true,
            })
            .onConflict((oc) => oc.column('id').doUpdateSet({
                name: 'CLI Test Key',
                key_hash: keyHash,
                key_prefix: keyPrefix,
                updated_at: new Date(),
            }))
            .returningAll()
            .execute();

        console.log('✅ API key created');
        console.log('🔑 Test API Key:', apiKey);
        console.log('📋 Key Details:');
        console.log('   - Name: CLI Test Key');
        console.log('   - Team: Test Team');
        console.log('   - Scope: full');
        console.log('   - Prefix: mk_test_55');

        console.log('\n🎉 Test data seeded successfully!');
        console.log('\n📝 You can now test the CLI routes with:');
        console.log(`   curl -H "X-API-Key: ${apiKey}" http://localhost:4000/api/cli/agents`);

    } catch (error) {
        console.error('❌ Error seeding test data:', error);
        process.exit(1);
    } finally {
        await db.destroy();
    }
}

// Run the seeding
seedTestData().catch(console.error); 