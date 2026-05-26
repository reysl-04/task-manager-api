import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"
import pool from "./pool.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const migrationsDir = path.join(__dirname, 'migrations')

async function migrate() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS migrations (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            filename VARCHAR(255) NOT NULL UNIQUE,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `)

    const { rows } = await pool.query(`SELECT filename FROM migrations`)
    const applied = new Set(rows.map(r => r.filename))
    
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith(`.sql`))
        .sort()
    
    for (const file of files) {
        if (applied.has(file)) {
            console.log(`${file} already applied`)
            continue
        }

        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')

        const upSection = sql.split(`-- down`)[0].replace(`-- up`, '')

        console.log(upSection)
        
        await pool.query(upSection)
        await pool.query(`INSERT INTO migrations (filename) VALUES ($1)`, [file])
        console.log(`Applied: ${file}`)
    }

    await pool.end()
    console.log(`Done.`)
}

migrate().catch(err => {
    console.error(`Migration Failed`, err)
    process.exit(1)
})