import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { DATABASE_URL } = process.env;

const configDataBase = {
  connectionString:DATABASE_URL
};
const { Pool } = pg;

export const db = new Pool(configDataBase);