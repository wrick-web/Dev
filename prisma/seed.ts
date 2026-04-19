import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Database seed script
 * Run with: npx prisma db seed
 * 
 * Use this file to add initial data to your database.
 * This is useful for setting up test data in development.
 */
async function main() {
  try {
    // Example: Create a welcome entry
    // Uncomment to use:
    /*
    const welcomeEntry = await prisma.entry.create({
      data: {
        title: 'Welcome to BuildDevLog!',
        body: '# Getting Started\n\nYou have successfully set up BuildDevLog. Start by creating your first entry to track your learning journey.',
        tags: JSON.stringify(['welcome', 'guide']),
      },
    })
    
    console.log('Created welcome entry:', welcomeEntry.id)
    */

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
