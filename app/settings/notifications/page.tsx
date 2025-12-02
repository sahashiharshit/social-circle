// app/settings/notifications/page.tsx
export default function NotificationSettingsPage() {
  return (
    <div className="max-w-xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <p className="opacity-75 text-sm">
          Choose how and when you want to be notified.
        </p>
      </section>

      <section className="space-y-4 border rounded-lg p-4 bg-background/70">
        <h3 className="font-medium text-sm">Email notifications</h3>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Friend requests</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Comments on your posts</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>Product updates & announcements</span>
          </label>
        </div>
      </section>

      <section className="space-y-4 border rounded-lg p-4 bg-background/70">
        <h3 className="font-medium text-sm">In-app notifications</h3>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Show notification badge on navbar</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Play sound for new notifications</span>
          </label>
        </div>
      </section>

      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Save notification settings
      </button>
    </div>
  );
}
