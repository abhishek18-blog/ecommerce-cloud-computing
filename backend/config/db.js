import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_DIALECT = process.env.DB_DIALECT || 'sqlite';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'ecommerce';
const MYSQL_USER = process.env.MYSQL_USER || process.env.DB_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
const MYSQL_HOST = process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1';
const MYSQL_PORT = process.env.MYSQL_PORT || process.env.DB_PORT || 3306;

let sequelize;

if (DB_DIALECT === 'mysql') {
  sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    dialect: 'mysql',
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './ecommerce.sqlite',
    logging: false,
  });
}

export default sequelize;
