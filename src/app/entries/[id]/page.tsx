import { EntryDetailClient } from './client'

/**
 * Entry detail page for viewing/editing a single entry.
 * Server component that awaits params and passes to client component.
 */
export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <EntryDetailClient id={id} />
}
