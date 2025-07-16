import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Mimic Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Stress-testing conversational AI agents
            </p>
          </div>
          <Link href="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* API Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>API Status</CardTitle>
              <CardDescription>Backend API health and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">
                  API is running
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Endpoint:{' '}
                <code className="bg-muted px-1 rounded">
                  http://localhost:4000/health
                </code>
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default">
                Create New Test
              </Button>
              <Button className="w-full" variant="outline">
                View Test Results
              </Button>
              <Button className="w-full" variant="outline">
                Manage Agents
              </Button>
            </CardContent>
          </Card>

          {/* Search Card */}
          <Card>
            <CardHeader>
              <CardTitle>Search Tests</CardTitle>
              <CardDescription>
                Find existing test configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Search tests..." />
                <Button className="w-full" variant="secondary">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest test runs and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Agent Stress Test #1</p>
                    <p className="text-sm text-muted-foreground">
                      Completed 2 hours ago
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Passed</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Conversation Flow Test</p>
                    <p className="text-sm text-muted-foreground">
                      Completed 5 hours ago
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Warning</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mimic v0.1.0 • Built with Next.js 15.4.1
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                Documentation
              </Button>
              <Button variant="ghost" size="sm">
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
