import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRoles1708100000000 implements MigrationInterface {
  name = 'UpdateUserRoles1708100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old enum type and create new one with all roles
    await queryRunner.query(`
      DO $$ 
      BEGIN
        -- Drop the existing constraint if exists
        IF EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'CHK_users_role'
        ) THEN
          ALTER TABLE users DROP CONSTRAINT "CHK_users_role";
        END IF;

        -- Drop the old enum type
        DROP TYPE IF EXISTS "users_role_enum" CASCADE;

        -- Create new enum type with all 5 roles
        CREATE TYPE "users_role_enum" AS ENUM (
          'user',
          'viewer', 
          'content_manager',
          'finance',
          'admin'
        );

        -- Alter the column to use the new enum type
        ALTER TABLE users 
        ALTER COLUMN role TYPE "users_role_enum" 
        USING role::text::"users_role_enum";

        -- Set default value
        ALTER TABLE users 
        ALTER COLUMN role SET DEFAULT 'user'::"users_role_enum";

      EXCEPTION
        WHEN OTHERS THEN
          RAISE NOTICE 'Role enum already updated or error occurred: %', SQLERRM;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to old enum
    await queryRunner.query(`
      DO $$ 
      BEGIN
        DROP TYPE IF EXISTS "users_role_enum" CASCADE;

        CREATE TYPE "users_role_enum" AS ENUM (
          'viewer',
          'moderator',
          'admin'
        );

        ALTER TABLE users 
        ALTER COLUMN role TYPE "users_role_enum" 
        USING role::text::"users_role_enum";

        ALTER TABLE users 
        ALTER COLUMN role SET DEFAULT 'viewer'::"users_role_enum";

      EXCEPTION
        WHEN OTHERS THEN
          RAISE NOTICE 'Error reverting role enum: %', SQLERRM;
      END $$;
    `);
  }
}
