import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SessionsPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sessions</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Start Session
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start a test session to begin testing your agents with personas.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Start Your First Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
