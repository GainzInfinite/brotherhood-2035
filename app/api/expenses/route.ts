import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Basic validation
    const { amount, category, notes, receivedDate } = body
    if (!amount || !receivedDate) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // For now persist-less: log to server console and return success
    console.log('Expense logged (temporary):', { amount, category, notes, receivedDate })

    return NextResponse.json({ success: true, data: { amount, category, notes, receivedDate } }, { status: 201 })
  } catch (error) {
    console.error('Error logging expense:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
