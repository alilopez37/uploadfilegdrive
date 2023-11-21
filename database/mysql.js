import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import signale from 'signale';

dotenv.config()

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  };

// Crear el pool de conexiones
const pool = mysql.createPool(config);

export const query = async (sql, params)=>{
  try {
    const conn = await pool.getConnection();
    signale.success("Conexión exitosa a la BD");
    const result = await conn.execute(sql, params); //Consultas preparadas
    conn.release();
    return result;
  } catch (error) {
    signale.error(error);
    return null;
  }
}

