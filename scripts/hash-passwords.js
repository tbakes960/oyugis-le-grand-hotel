/**
 * scripts/hash-passwords.js
 *
 * One-time setup script: hashes all plaintext passwords in data/accounts.json
 * using bcrypt (cost factor 12) and writes the result back.
 *
 * Run once after cloning / first deploy:
 *   node scripts/hash-passwords.js
 *
 * Safe to re-run — already-hashed passwords (starting with $2b$) are skipped.
 */

const bcrypt = require('bcryptjs')
const fs     = require('fs')
const path   = require('path')

const FILE = path.join(__dirname, '..', 'data', 'accounts.json')
const COST = 12

async function main() {
  let data
  try {
    data = JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  } catch (err) {
    console.error('Could not read data/accounts.json:', err.message)
    process.exit(1)
  }

  let changed = false

  for (const [key, account] of Object.entries(data)) {
    if (!account.password) continue

    if (account.password.startsWith('$2a$') || account.password.startsWith('$2b$')) {
      console.log(`  [${key}] Already hashed — skipping`)
      continue
    }

    console.log(`  [${key}] Hashing password for ${account.email} ...`)
    data[key].password = await bcrypt.hash(account.password, COST)
    changed = true
    console.log(`  [${key}] Done`)
  }

  if (changed) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8')
    console.log('\ndata/accounts.json updated with hashed passwords.')
  } else {
    console.log('\nAll passwords are already hashed. Nothing changed.')
  }
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
