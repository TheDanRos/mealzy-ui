import { NextResponse } from 'next/server'
import axios from 'axios'

const GITHUB_TOKEN = process.env.NEO_GITHUB_TOKEN
const REPO = 'TheDanRos/mealzy-ui'
const GITHUB_API = 'https://api.github.com'

export async function POST(req: Request) {
  const { path, patch, branch, message, title, body } = await req.json()

  if (!path || !patch || !branch || !message || !title) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen (path, patch, branch, message, title)' }, { status: 400 })
  }

  try {
    // Hole Default-Branch
    const { data: repo } = await axios.get(`${GITHUB_API}/repos/${REPO}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    })
    const baseBranch = repo.default_branch

    // Hole SHA des HEAD von main
    const { data: ref } = await axios.get(`${GITHUB_API}/repos/${REPO}/git/ref/heads/${baseBranch}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    })

    // Erstelle neuen Branch
    await axios.post(`${GITHUB_API}/repos/${REPO}/git/refs`, {
      ref: `refs/heads/${branch}`,
      sha: ref.object.sha
    }, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    })

    // Hole SHA der Datei, wenn vorhanden
    let fileSha = undefined
    try {
      const { data: existing } = await axios.get(`${GITHUB_API}/repos/${REPO}/contents/${path}?ref=${branch}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      })
      fileSha = existing.sha
    } catch {
      console.log('Neue Datei')
    }

    const encoded = Buffer.from(patch).toString('base64')

    // Commit Datei
    await axios.put(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
      message,
      content: encoded,
      branch,
      sha: fileSha
    }, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    })

    // PR erstellen
    const { data: pr } = await axios.post(`${GITHUB_API}/repos/${REPO}/pulls`, {
      title,
      head: branch,
      base: baseBranch,
      body: body || ''
    }, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    })

    return NextResponse.json({ status: 'success', pr_url: pr.html_url })
  } catch (err: any) {
    console.error('Fehler bei github-pr:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
