/**
 * lib/store.js
 * Lightweight JSON file-based data store for local/development use.
 * Each "collection" is a separate JSON file under /data/.
 *
 * Thread-safety: all mutating operations on the same collection are
 * serialised through a per-collection Promise-chain mutex so concurrent
 * requests cannot interleave their read-modify-write cycles.
 *
 * When you connect a real PostgreSQL database, replace these helpers with
 * the equivalent Prisma calls (see prisma/schema.prisma for the models).
 */

import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// ── Path-safety ────────────────────────────────────────────────────────────
// Only allow plain alphanumeric names with hyphens/underscores (no slashes,
// dots, or other characters that could escape the data directory).
const SAFE_NAME_RE = /^[a-z0-9_-]{1,64}$/i

function assertSafeName(name) {
  if (!SAFE_NAME_RE.test(name)) {
    throw new Error(`Invalid collection name: "${name}"`)
  }
}

// ── Per-collection mutex (Promise-chain pattern) ────────────────────────────
// Maps collection name → the tail of the current Promise chain.
// Every operation appends to the chain, so they execute in FIFO order.
const _locks = new Map()

async function withLock(name, fn) {
  const prev = _locks.get(name) || Promise.resolve()

  let releaseNext
  const next = new Promise(resolve => { releaseNext = resolve })
  _locks.set(name, next)

  // Wait for the previous operation on this collection to finish.
  await prev.catch(() => {}) // ignore upstream errors

  try {
    return await fn()
  } finally {
    releaseNext()
    // Clean up map entry when we are the last waiter.
    if (_locks.get(name) === next) _locks.delete(name)
  }
}

// ── Low-level helpers ───────────────────────────────────────────────────────

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

async function readStore(name) {
  assertSafeName(name)
  await ensureDir()
  const file = path.join(DATA_DIR, `${name}.json`)
  try {
    const content = await fs.readFile(file, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

async function writeStore(name, data) {
  assertSafeName(name)
  await ensureDir()
  const file = path.join(DATA_DIR, `${name}.json`)
  // Write to a temp file then rename for atomic replacement.
  const tmp = file + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, file)
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Return all records in a collection (read-only, no lock needed). */
export async function getAll(name) {
  return readStore(name)
}

/** Append a new record to a collection and return it. */
export async function append(name, item) {
  return withLock(name, async () => {
    const items = await readStore(name)
    items.push(item)
    await writeStore(name, items)
    return item
  })
}

/** Update a single record by id. Returns the updated record or null. */
export async function updateById(name, id, updates) {
  return withLock(name, async () => {
    const items = await readStore(name)
    const idx = items.findIndex(i => i.id === id)
    if (idx === -1) return null
    items[idx] = { ...items[idx], ...updates }
    await writeStore(name, items)
    return items[idx]
  })
}

/** Find records matching a predicate. */
export async function findWhere(name, predicate) {
  const items = await readStore(name)
  return items.filter(predicate)
}
