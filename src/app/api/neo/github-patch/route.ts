// 📦 /api/neo/github-patch/route.ts
// Erlaubt Neo, Dateiänderungen vorzuschlagen und automatisch an GitHub zu pushen

import { NextResponse } from 'next/server'
import axios from 'axios'

const GITHUB_TOKEN = process.env.NEO_GITHUB_TOKEN
const REPO = 'TheDanRos/mealzy-ui'
const GITHUB_API = 'https://api.github.com'

export async function POST(req: Request) {
  const { path, patch, branch, message } = await req.json()

  if (!path || !patch || !branch || !message) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen (path, patch, branch, message)' }, { status: 400 })
  }

  try {
    // Hole Default-Branch (z. B. main) SHA
    const { data: repo } = await axios.get(`${GITHUB_API}/repos/${REPO}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    })
    const baseBranch = repo.default_branch

    // Hole den SHA des HEAD-Commits von main
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

    // Hole SHA der Datei (falls sie existiert)
    let fileSha = undefined
    try {
      const { data: existing } = await axios.get(`${GITHUB_API}/repos/${REPO}/contents/${path}?ref=${branch}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      })
      fileSha = existing.sha
    } catch (e) {
      console.log('Neue Datei, kein SHA vorhanden.')
    }

    // Encode Inhalt
    const encoded = Buffer.from(patch).toString('base64')

    // Commit Dateiänderung
    await axios.put(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
      message,
      content: encoded,
      branch,
      sha: fileSha
    }, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    })

    return NextResponse.json({ status: 'success', branch })
  } catch (err: any) {
    console.error('Fehler bei github-patch:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
