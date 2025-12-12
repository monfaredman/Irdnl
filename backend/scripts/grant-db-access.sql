-- Ensure you're connected as a superuser (e.g. postgres) before running this script.
-- Update role/database names if your environment uses different credentials.

DO $do$
DECLARE
  role_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'monfaredman_user'
  ) INTO role_exists;

  IF NOT role_exists THEN
    EXECUTE 'CREATE ROLE monfaredman_user WITH LOGIN PASSWORD ''MonfaredMan@2024''';
  ELSE
    EXECUTE 'ALTER ROLE monfaredman_user WITH LOGIN PASSWORD ''MonfaredMan@2024''';
  END IF;
END
$do$;

ALTER DATABASE irdnl_db OWNER TO monfaredman_user;
GRANT ALL PRIVILEGES ON DATABASE irdnl_db TO monfaredman_user;

ALTER SCHEMA public OWNER TO monfaredman_user;
GRANT USAGE, CREATE ON SCHEMA public TO monfaredman_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO monfaredman_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO monfaredman_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO monfaredman_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO monfaredman_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO monfaredman_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON FUNCTIONS TO monfaredman_user;
