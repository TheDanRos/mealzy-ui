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
    const { data: repoInfo } = await github.get(`/repos/${REPO}`)
    return NextResponse.json({
      name: repoInfo.full_name,
      description: repoInfo.description,
      stars: repoInfo.stargazers_count
    })
  } catch (err: any) {
  console.error('Fehler bei github-metadata:', err.message)
    return NextResponse.json({ error: 'Metadaten konnten nicht geladen werden' }, { status: 500 })
  }
}
