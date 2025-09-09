export interface TSecurityScan {
  id: string
  tool: string
  mode: string
  target: string
  source: string
  branch?: string
  commit_sha?: string
  status: "failed" | "success" | "running" | "error"
  created_at: string
  updated_at: string
  metadata?: Record<string, object>
  tenant_id: string
  triggered_at: string
  counts: {
      critical: number,
      high: number,
      medium: number,
      low: number,
      total: number,
    }
  duration_ms: number,
  artifact_url: string
}

export interface TAnalyzeFinding {
  title: string
  summary: string
  severity: "critical" | "high" | "medium" | "low"
  recommendation: string
}

export interface TAnalyzeResult {
  advice: string
  counts: {
    critical: number
    high: number
    medium: number
    low: number
    total: number
  }
  file_url: string
  findings: TAnalyzeFinding[]
}

export interface TAnalyze {
  id: string
  scan_id: string
  tenant_id: string
  created_at: string
  file_url: string
  result: string 
}