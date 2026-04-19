import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children, tab, setTab, handleLogout, tabLabel }) {
  const role = localStorage.getItem("role");
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar tab={tab} setTab={setTab} role={role} />

      {/* Main Area */}
      <div className="flex flex-col flex-1">

      <Topbar tabLabel={tabLabel} onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">

        <div className="max-w-7xl mx-auto w-full bg-white rounded-2xl shadow-md p-6">

          {children}

        </div>

      </main>

      </div>
    </div>
  );
}
