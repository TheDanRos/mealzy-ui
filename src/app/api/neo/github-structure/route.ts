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

// ✅ Interface oben definieren
interface GitHubFile {
  name: string
  type: string
  [key: string]: any
}

export async function GET() {
  try {
    const { data: files } = await github.get(`/repos/${REPO}/contents/`)

    const simplifiedFiles = (files as GitHubFile[]).map(f => ({
      name: f.name,
      type: f.type
    })).slice(0, 20)

    return NextResponse.json({ files: simplifiedFiles })
  } catch (err: any) {
    console.error('Fehler bei github-structure:', err.message)
    return NextResponse.json({ error: 'Strukturanalyse fehlgeschlagen' }, { status: 500 })
  }
}
