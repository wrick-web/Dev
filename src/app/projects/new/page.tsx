import { ProjectForm } from '@/components/project-form'

/**
 * Page for creating a new project.
 */
export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <ProjectForm />
    </div>
  )
}
