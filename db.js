import pg from "pg";

/*
    Depending you need, comment out appropriately
    1. The first one is for Production - i.e working online with railway db (which you'll need to dump your local dump to regularly)
    2. The Second one is for Development (which means you working with local db)
*/

// Number 1

// const db = new pg.Client({
// connectionString: process.env.DATABASE_URL, // Railway injects this
// ssl: { rejectUnauthorized: false }, // Required for Railway PostgreSQL
// });

// Nimber 2

const db = new pg.Client({
  host: "localhost",
  database: "relateplus",
  user: "postgres",
  port: 5432,
  password: "EmDes12@",
});

export default db; // Changed from module.exports to export default
