import mysql from 'mysql2/promise'
import {ApiError} from '../utils/ApiError'
import dotenv from 'dotenv';

dotenv.config()

const db=mysql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
  waitForConnections:true,
  connectionLimit:10,
  queueLimit:0
})

const connectDB=async()=>{
  try{
    const connection=await db.getConnection();
    console.log(`\n MySQL connected !! DB HOST: ${connectionInstance.connection.host}`)
    console.log(`${connectionInstance}`)
    connection.release()
  }catch(error){
    console.error('MySQL connection error',error)
    process.exit(1);
  }
}

export default connectDB