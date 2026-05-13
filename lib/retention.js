import { getAll } from '@/lib/store'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

/**
 * lib/retention.js
 * Data retention policy enforcement.
 * Deletes records older than DATA_RETENTION_DAYS (default: 365).
 *
 * Usage — trigger from admin settings or Vercel cron:
 *   import { runRetention } from '@/lib/retention'
 *   const result = await runRetention()
 *
 * Configure via .env.local:
 *   DATA_RETENTION_DAYS=365
 */

function getRetentionMs() {
  const days = parseInt(process.env.DATA_RETENTION_DAYS || '365', 10)
  return Math.max(30, days) * 24 * 60 * 60 * 1000
}

async function pruneCollection(collection, retentionMs) {
  const filePath = path.join(DATA_DIR, `${collection}.json`)
  try {
    const raw  = await fs.readFile(filePath, 'utf-8')
    const items = JSON.parse(raw)
    const cutoff = Date.now() - retentionMs

    const kept    = items.filter(r => {
      const created = r.createdAt ? new Date(r.createdAt).getTime() : Infinity
      return created > cutoff
    })
    const pruned = items.length - kept.length

    if (pruned > 0) {
      const tmp = filePath + '.tmp'
      await fs.writeFile(tmp, JSON.stringify(kept, null, 2), 'utf-8')
      await fs.rename(tmp, filePath)
    }
    return pruned
  } catch {
    return 0
  }
}

export async function runRetention() {
  const retentionMs = getRetentionMs()
  const retentionDays = Math.round(retentionMs / (24 * 60 * 60 * 1000))

  const [contactsPruned, conferencesPruned] = await Promise.all([
    pruneCollection('contacts',    retentionMs),
    pruneCollection('conferences', retentionMs),
    // Bookings are kept indefinitely for accounting purposes — remove line below to include them
    // pruneCollection('bookings', retentionMs),
  ])

  return {
    ranAt: new Date().toISOString(),
    retentionDays,
    pruned: { contacts: contactsPruned, conferences: conferencesPruned },
  }
}
