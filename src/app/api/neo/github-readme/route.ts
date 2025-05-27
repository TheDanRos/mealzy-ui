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
    const { data: rootFiles } = await github.get(`/repos/${REPO}/contents/`)
    const readmeFile = rootFiles.find(f => f.name.toLowerCase().startsWith('readme'))

    if (!readmeFile) return NextResponse.json({ readme: null })

    const { data: content } = await github.get(readmeFile.download_url)
    return NextResponse.json({ readme: content.slice(0, 500) })
  } catch (err) {
    console.error('Fehler bei github-readme:', err.message)
    return NextResponse.json({ error: 'README konnte nicht geladen werden' }, { status: 500 })
  }
}
