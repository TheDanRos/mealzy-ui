// 📦 /api/neo/github-delete/route.ts
// Ermöglicht das Löschen von Dateien im GitHub-Repo

import { NextResponse } from 'next/server'
import axios from 'axios'

const GITHUB_TOKEN = process.env.NEO_GITHUB_TOKEN
const REPO = 'TheDanRos/mealzy-ui'

export async function DELETE(req: Request) {
  const { path, branch, message } = await req.json()

  if (!path || !branch || !message) {
    return NextResponse.json(
      { error: 'Pflichtfelder fehlen (path, branch, message)' },
      { status: 400 }
    )
  }

  try {
    // Hole SHA der Datei
    const { data: fileData } = await axios.get(
      `https://api.github.com/repos/${REPO}/contents/${path}?ref=${branch}`,
      {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      }
    )

    // Lösche Datei via GitHub API
    await axios.delete(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
      data: {
        message,
        sha: fileData.sha,
        branch
      }
    })

    return NextResponse.json({ status: 'deleted', path })
  } catch (err: any) {
    console.error('Fehler beim Löschen:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
