import 'dotenv/config'
export const env = {
  MONGODB_URL: process.env.MONGODB_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  HOSTNAME: process.env.HOSTNAME,
  BUILD_MODE: process.env.BUILD_MODE,
  PORT: process.env.PORT
}