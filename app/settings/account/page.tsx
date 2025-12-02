// app/settings/account/page.tsx
export default function AccountSettingsPage() {
  return (
    <div className="max-w-xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Account</h2>
        <p className="opacity-75 text-sm">
          Manage your login and security details.
        </p>
      </section>

      {/* Email section */}
      <section className="space-y-3 border rounded-lg p-4 bg-background/70">
        <h3 className="font-medium text-sm">Email</h3>
        <p className="text-xs opacity-70">
          This email is used for login and important notifications.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Update email
          </button>
        </form>
      </section>

      {/* Password section */}
      <section className="space-y-3 border rounded-lg p-4 bg-background/70">
        <h3 className="font-medium text-sm">Change password</h3>
        <form className="space-y-3">
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="Current password"
          />
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="New password"
          />
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="Confirm new password"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Update password
          </button>
        </form>
      </section>

      {/* Danger zone */}
      <section className="space-y-3 border rounded-lg p-4 bg-red-500/5 border-red-500/40">
        <h3 className="font-medium text-sm text-red-500">Danger zone</h3>
        <p className="text-xs opacity-80">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          type="button"
          className="rounded-md border border-red-500/60 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10"
        >
          Delete account
        </button>
      </section>
    </div>
  );
}
