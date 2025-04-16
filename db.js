import pg from 'pg';

const db = new pg.Client({
    host: "localhost",
    database: "relateplus",
    user: "postgres",
    port: 5432,
    password: "EmDes12@"
});

export default db;  // Changed from module.exports to export default