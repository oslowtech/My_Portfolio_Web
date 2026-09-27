import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'online', system: 'PRANJAL GIRI PORTFOLIO', timestamp: new Date().toISOString() })
}
