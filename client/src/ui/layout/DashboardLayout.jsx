import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children, tab, setTab, handleLogout, tabLabel }) {
  const menu = [
    { key: "overview", label: "Overview" },
    { key: "progress", label: "Student Progress" },
    { key: "upload", label: "Data Upload" },
    { key: "students", label: "Create Student" },
  ];
  
  const currentTab = menu.find((item) => item.key === tab);
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar tab={tab} setTab={setTab} />

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