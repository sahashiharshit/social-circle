


export default function DashboardLayout({
  navbar,
  sidebar,
  main,
  session
}: {
    
    navbar:React.ReactNode;
    main:React.ReactNode;
    sidebar:React.ReactNode;
    session:any
}) {
 
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Navbar */}
      <header className="h-[60px] ">{navbar}</header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[250px] ">{sidebar}</aside>

        {/* Main */}
        <main className="flex-1 overflow-hidden">{main}</main>
      </div>
    </div>
  );
}
