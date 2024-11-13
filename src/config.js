

import { config } from "dotenv";

config();
// const app = {
//     port: process.env.PORT || 3000
// }

// export default app;

import { createPool } from 'mysql2/promise';

//pasar esto al .env
const pool = createPool({
    host: process.env.HOST_DB, 
    port: process.env.PORT_DB,
    user: process.env.USER_DB,
    database: process.env.DB,
    password: process.env.PASSWORD_DB

})

export default pool;

