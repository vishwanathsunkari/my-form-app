export const dynamic = 'force-dynamic' // ← add this line

import { getPayload } from 'payload'
import config from '@payload-config'
import { SubmissionsClient } from './SubmissionsClient'

export default async function SubmissionsPage() {
  const payload = await getPayload({ config })

  const { docs: contacts, totalDocs } = await payload.find({
    collection: 'Contacts',
    sort: '-createdAt',
    overrideAccess: true,
    limit: 100,
  })

  const stats = {
    total: totalDocs,
    newCount: contacts.filter((c) => c.status === 'new').length,
    repliedCount: contacts.filter((c) => c.status === 'replied').length,
  }

  return <SubmissionsClient contacts={contacts} stats={stats} />
}
