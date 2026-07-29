import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';

export default function AppLayout({ user, setUser, onLogout, children }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Topbar user={user} setUser={setUser} onLogout={onLogout} />
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}
