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

type GitHubFile = {
  name: string
  download_url: string
  [key: string]: any
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lineCount = parseInt(searchParams.get('lines') || '5')

  try {
    const { data: rootFiles } = await github.get(`/repos/${REPO}/contents/`)
    const typedFiles = rootFiles as GitHubFile[]

    const readmeFile = typedFiles.find((f) =>
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
