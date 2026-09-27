export interface GitHubRepoStats {
  stars: number
  forks: number
  language: string | null
  description: string | null
  updated_at: string
  topics: string[]
}

export async function fetchRepoStats(repoUrl: string): Promise<GitHubRepoStats | null> {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return null
    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '')
    const res = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 }
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      description: data.description,
      updated_at: data.updated_at,
      topics: data.topics || [],
    }
  } catch {
    return null
  }
}
