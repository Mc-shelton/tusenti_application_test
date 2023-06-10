SELECT 'CREATE DATABASE testdb' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'testdb');

\c testdb;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE transactions(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    amount int,
    type varchar,
    userID varchar,
    date date
)