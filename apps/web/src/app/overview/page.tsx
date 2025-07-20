export default function OverviewPage() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-muted-foreground">Running tests</p>
          </div>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Total Personas</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-muted-foreground">Available personas</p>
          </div>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Connected Agents</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-muted-foreground">Active agents</p>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 min-h-[400px] flex-1 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="font-medium">No recent activity</p>
              <p className="text-sm text-muted-foreground">
                Start your first test session to see activity here
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
