// 📄 /api/neo/github-file/route.ts
// Liefert den Inhalt einer bestimmten Datei aus dem Mealzy-Repo zurück

import { NextResponse } from 'next/server'
import axios from 'axios'

const GITHUB_TOKEN = process.env.NEO_GITHUB_TOKEN
const REPO = 'TheDanRos/mealzy-ui'

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    'User-Agent': 'Neo-Agent'
  }
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'Pfad fehlt: ?path=src/components/Button.tsx' }, { status: 400 })
  }

  try {
    const { data } = await github.get(`/repos/${REPO}/contents/${path}`)
    const decoded = Buffer.from(data.content, 'base64').toString('utf-8')

    return NextResponse.json({
      path,
      lines: decoded.split('\n').length,
      content: decoded.slice(0, 2000) // GPT-freundlicher Ausschnitt
    })
  } catch (err: any) {
    console.error('Fehler bei github-file:', err.message)
    return NextResponse.json({ error: 'Datei konnte nicht geladen werden' }, { status: 500 })
  }
}
