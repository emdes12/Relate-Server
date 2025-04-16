import pg from 'pg';

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL, // Railway injects this
    ssl: { rejectUnauthorized: false }, // Required for Railway PostgreSQL
    host: "localhost",
    database: "relateplus",
    user: "postgres",
    port: 5432,
    password: "EmDes12@"
});

export default db;  // Changed from module.exports to export default