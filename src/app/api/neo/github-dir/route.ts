// 📂 /api/neo/github-dir/route.ts
// Gibt die Struktur eines GitHub-Verzeichnisses zurück (Name + Typ)

import { NextResponse } from 'next/server'
import axios from 'axios'

const GITHUB_TOKEN = process.env.NEO_GITHUB_TOKEN
const REPO = 'TheDanRos/mealzy-ui'
const GITHUB_API = 'https://api.github.com'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || ''

  try {
    const { data } = await axios.get(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Neo-Agent'
      }
    })

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Kein Verzeichnis' }, { status: 400 })
    }

    const items = data.map((entry: any) => ({
      name: entry.name,
      type: entry.type
    }))

    return NextResponse.json({ path, items })
  } catch (err: any) {
    console.error('Fehler bei github-dir:', err.message)
    return NextResponse.json({ error: 'Verzeichnis konnte nicht geladen werden' }, { status: 500 })
  }
}
