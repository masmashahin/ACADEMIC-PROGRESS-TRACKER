import { 
    FiHome, 
    FiTrendingUp, 
    FiUpload, 
    FiUserPlus 
  } from "react-icons/fi";
export default function Sidebar({ tab, setTab }) {
    const menu = [
      { key: "overview", label: "Overview", icon: <FiHome /> },
      { key: "progress", label: "Student Progress", icon: <FiTrendingUp /> },
      { key: "upload", label: "Data Upload", icon: <FiUpload /> },
      { key: "students", label: "Create Student", icon: <FiUserPlus /> },
    ];
  
    return (
      <aside className="w-64 bg-white/90 backdrop-blur border-r flex flex-col">
  
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b">

            {/* Icon */}
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold">
                A
            </div>

            {/* Title */}
            <div>
                <p className="text-sm text-gray-500">Academic Progress</p>
                <p className="text-lg font-semibold text-gray-800">
                Tracker
                </p>
            </div>

        </div>
  
        {/* Menu */}
        <nav className="p-4 space-y-2 mt-2">
          {menu.map((item) => (
            <div
              key={item.key}
              onClick={() => {setTab(item.key);
              localStorage.setItem("facultyTab", item.key);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-sm hover:scale-[1.02] ${
                tab === item.key
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
  
      </aside>
    );
}