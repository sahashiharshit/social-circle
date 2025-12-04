export default function SettingsSidebarSkeleton() {
  return (
    <aside className="w-64 h-full bg-muted/30 p-4 space-y-4">
      <div className="h-5 w-40 bg-muted rounded-md" />

      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-10 w-full bg-muted rounded-md" />
      ))}
    </aside>
  );
}
