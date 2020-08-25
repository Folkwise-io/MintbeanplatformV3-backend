CREATE USER mintbean WITH PASSWORD 'password';
ALTER USER mintbean CREATEDB;
ALTER USER mintbean SUPERUSER;

CREATE DATABASE mintbean_development_v3;
\c mintbean_development_v3;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER DATABASE mintbean_development_v3 OWNER TO mintbean;
GRANT ALL PRIVILEGES ON DATABASE mintbean_development_v3 TO mintbean;

CREATE DATABASE mintbean_test_v3;
\c mintbean_test_v3;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER DATABASE mintbean_test_v3 OWNER TO mintbean;
GRANT ALL PRIVILEGES ON DATABASE mintbean_test_v3 TO mintbean;
