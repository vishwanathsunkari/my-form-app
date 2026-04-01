import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const payload = await getPayload({ config })

    // Create a new contact entry — no auth needed (access: create: () => true)
    const contact = await payload.create({
      collection: 'Contacts',
      data: {
        name: body.name,
        email: body.email,
        message: body.message,
      },
    })

    return NextResponse.json({ success: true, id: contact.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
