'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEntries, useProjects, useResources } from '@/lib/hooks'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { parseJSON } from '@/lib/utils'

/**
 * Dashboard page displaying analytics and insights.
 * Shows stats, activity chart, streak calculation, and tag cloud.
 */
export default function DashboardPage() {
  const entriesQuery = useEntries(0, 100)
  const projectsQuery = useProjects()
  const resourcesQuery = useResources(undefined, undefined, 0, 100)

  // Calculate activity data for the last 8 weeks
  const activityData = useMemo(() => {
    if (!entriesQuery.data?.entries) return []

    const entries = entriesQuery.data.entries as any[]
    const today = new Date()
    const weeks: { [key: string]: number } = {}

    // Initialize last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i * 7)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const key = weekStart.toISOString().split('T')[0]
      weeks[key] = 0
    }

    // Count entries per week
    entries.forEach((entry) => {
      const entryDate = new Date(entry.date)
      const weekStart = new Date(entryDate)
      weekStart.setDate(entryDate.getDate() - entryDate.getDay())
      const key = weekStart.toISOString().split('T')[0]
      if (key in weeks) {
        weeks[key]++
      }
    })

    return Object.entries(weeks).map(([date, count]) => ({
      week: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      entries: count,
    }))
  }, [entriesQuery.data])

  // Calculate streak (consecutive days of logging)
  const streak = useMemo(() => {
    if (!entriesQuery.data?.entries) return 0

    const entries = entriesQuery.data.entries as any[]
    const dates = entries.map((e) => new Date(e.date).toDateString())
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let currentStreak = 0
    let expectedDate = new Date()
    expectedDate.setHours(0, 0, 0, 0)

    for (const dateStr of uniqueDates) {
      const date = new Date(dateStr)
      if (date.toDateString() === expectedDate.toDateString()) {
        currentStreak++
        expectedDate.setDate(expectedDate.getDate() - 1)
      } else {
        break
      }
    }

    return currentStreak
  }, [entriesQuery.data])

  // Calculate top 5 tags
  const topTags = useMemo(() => {
    if (!entriesQuery.data?.entries) return []

    const entries = entriesQuery.data.entries as any[]
    const tagCounts: { [key: string]: number } = {}

    entries.forEach((entry) => {
      const tags = parseJSON(entry.tags, [])
      tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))
  }, [entriesQuery.data])

  const isLoading =
    entriesQuery.isLoading || projectsQuery.isLoading || resourcesQuery.isLoading

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  const totalEntries = entriesQuery.data?.total || 0
  const totalProjects = projectsQuery.data?.projects?.length || 0
  const totalResources = resourcesQuery.data?.total || 0

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResources}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Entries logged per week (last 8 weeks)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="entries" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tag Cloud */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tags</CardTitle>
          <CardDescription>Most frequently used tags in your entries</CardDescription>
        </CardHeader>
        <CardContent>
          {topTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topTags.map(({ tag, count }) => (
                <Badge key={tag} variant="secondary">
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tags yet. Start creating entries!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
