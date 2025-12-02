// app/settings/privacy/page.tsx
export default function PrivacySettingsPage() {
  return (
    <div className="max-w-xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Privacy</h2>
        <p className="opacity-75 text-sm">
          Control who can see your content and interact with you.
        </p>
      </section>

      <section className="space-y-4 border rounded-lg p-4 bg-background/70">
        <div className="space-y-1">
          <label className="text-sm font-medium">Profile visibility</label>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60">
            <option value="public">Public</option>
            <option value="friends">Friends only</option>
            <option value="private">Only me</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Who can send you friends</label>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60">
            <option value="public">Everyone</option>
            <option value="friends">Friends of friends</option>
            <option value="private">No one</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Search visibility</label>
          <p className="text-xs opacity-70">
            Allow your profile to appear in search results.
          </p>
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="search" defaultChecked />
              <span>Allow</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="search" />
              <span>Don&apos;t allow</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Save privacy settings
        </button>
      </section>
    </div>
  );
}
