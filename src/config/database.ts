import { Pool } from 'pg';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from './configBd';

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: 5432,
});

export default pool;