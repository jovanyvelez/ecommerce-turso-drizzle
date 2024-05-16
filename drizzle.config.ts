import {Config} from 'drizzle-kit'
import 'dotenv/config'

export default {
    schema: './src/lib/server/schema.ts',
    out: './migrations',
    driver: 'turso',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.DB_URL,
        authToken: process.env.DB_TOKEN
    },
    verbose: true,
    strict: true,
} satisfies Config;