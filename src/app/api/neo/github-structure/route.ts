// SPLIT 1: /api/neo/github-structure
// Gibt reduzierte Dateiliste zurück

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

export async function GET() {
  try {
    const { data: files } = await github.get(`/repos/${REPO}/contents/`)
    return NextResponse.json({
      files: files.map(f => ({ name: f.name, type: f.type })).slice(0, 20)
    })
  } catch (err: any) {
  console.error('Fehler bei github-metadata:', err.message)
    return NextResponse.json({ error: 'Strukturanalyse fehlgeschlagen' }, { status: 500 })
  }
}
