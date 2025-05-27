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
  const lineCount = parseInt(searchParams.get('lines') || '5') // Standard: 5 Zeilen

  try {
    const { data: rootFiles } = await github.get(`/repos/${REPO}/contents/`)
    const readmeFile = (rootFiles as { name: string }[]).find((f) =>
      f.name.toLowerCase().startsWith('readme')
    )
    if (!readmeFile) return NextResponse.json({ readme: null })

    const { data: content } = await github.get(readmeFile.download_url)
    const lines = content
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .slice(0, lineCount)
      .join('\n')

    return NextResponse.json({ readme: lines })
  } catch (err: any) {
    console.error('Fehler bei github-readme:', err.message)
    return NextResponse.json(
      { error: 'README konnte nicht geladen werden' },
      { status: 500 }
    )
  }
}
