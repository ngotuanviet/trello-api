import 'dotenv/config'
export const env = {
  MONGODB_URL: process.env.MONGODB_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  HOSTNAME: process.env.HOSTNAME,
  PORT: process.env.PORT
}