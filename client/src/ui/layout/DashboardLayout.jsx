import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1">

        <Topbar />

        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}