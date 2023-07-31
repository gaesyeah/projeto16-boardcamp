import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { DATABASE_URL } = process.env;

const configDataBase = {
  connectionString:DATABASE_URL
};
const { Pool } = pg;

export const db = new Pool(configDataBase);

if (process.env.NODE_ENV === "production") configDataBase.ssl = true;

db.connect((error, client, done) => {
  if (error) return console.log('Erro ao conectar ao banco de dados:', error);
  console.log('Conexão bem-sucedida com o banco de dados PostgreSQL');
  done();
})
