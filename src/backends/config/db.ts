// db.ts
// import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// const sequelize = new Sequelize({
//   dialect: 'mysql',
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   database: process.env.DB_DATABASE,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
//   logging: false, // Disable SQL logging
// });

// const sequelize = new Sequelize(
//   process.env.DB_DATABASE || 'bpay_core',
//   process.env.DB_USERNAME || 'backendapiMt1',
//   process.env.DB_PASSWORD || 'm80meCoreMKsaGH90',
//   {
//     host: process.env.DB_HOST || 'bpaybackend.chqkma826ygl.eu-west-2.rds.amazonaws.com',
//     dialect: 'mysql',
//     port: Number(process.env.DB_PORT) || 5432,
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false
//       }
//     },
//     logging: false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   }
// );

// Function to establish connection and sync models
// export const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection to the database has been established successfully.');

//     // Sync all models to the database
//     await sequelize.sync({ alter: true }); // This will check the database tables and add missing fields
//     console.log('All models were synchronized successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

// export default sequelize;



import mysql from 'mysql2/promise';

export async function query({ query = '', values = [] }) {
  const dbconnection = await mysql.createConnection({
    host: process.env.DB_HOST || '',
    database: process.env.DB_DATABASE || '',
    user: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return results;
  } catch (error: any) {
    throw Error(error.message);
    return { error };
  }
}
