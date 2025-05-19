import pg from "pg";
import pkg from 'pg';
const { Pool } = pkg;

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

// export default db; // Changed from module.exports to export default

// Nimber 2

// const db = new pg.Client({
//   host: "localhost",
//   database: "relateplus",
//   user: "postgres",
//   port: 5432,
//   password: "EmDes12@",
// });

// export default db; // Changed from module.exports to export default

// Number 3 - for Pool
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  idleTimeoutMillis: 30000,   // 30 seconds
  connectionTimeoutMillis: 2000, // 2 seconds
});

db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// export const query = (text, params) => pool.query(text, params);

export default db; 