import { EntryForm } from '@/components/entry-form'

/**
 * Page for creating a new entry.
 */
export default function NewEntryPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <EntryForm />
    </div>
  )
}
