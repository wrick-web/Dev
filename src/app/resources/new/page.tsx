import { ResourceForm } from '@/components/resource-form'

/**
 * Page for adding a new resource.
 */
export default function NewResourcePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <ResourceForm />
    </div>
  )
}
