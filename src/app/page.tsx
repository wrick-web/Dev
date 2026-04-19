import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to BuildDevLog</h1>
        <p className="text-lg text-muted-foreground">
          Your personal learning journal and project tracker for developers
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
          <Link href="/entries">
            <Button variant="outline" size="lg">
              View Entries
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
