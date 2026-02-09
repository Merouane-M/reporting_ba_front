import { useNavigate } from "react-router-dom";

function Sidebar({ isExpanded, isPinned, setIsPinned, files = ["DEE", "DGR"] }) {
  const navigate = useNavigate();

  return (
    <aside className="h-screen flex flex-col ">
      {/* Top section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img
            src="logo-sofinance-white.svg"
            className="h-10 w-10"
            alt="Sofinance logo"
          />

          {isExpanded && (
            <span className="font-semibold text-sm">
              Sofinance reporting
            </span>
          )}
        </div>

        {isExpanded && (
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`
              h-4 w-4 rounded-full border-2
              ${isPinned ? "bg-white border-white" : "border-white"}
            `}
            title="Pin sidebar"
          />
        )}
      </div>

      {/* Navigation - Only show when pinned */}
      <nav className="flex-1 px-2 space-y-1">
        {isExpanded && (
          <>
            <button
              onClick={() => navigate("/home")}
              className="w-full text-left rounded px-3 py-2 text-sm
                         hover:bg-white/10 transition"
            >
              Accueil
            </button>

            <div className="pt-2 border-t border-white/20 space-y-1">
              {files.map((file) => (
                <button
                  key={file}
                  onClick={() => navigate(`/${file}`)}
                  className="w-full text-left rounded px-3 py-2 text-sm
                             hover:bg-white/10 transition"
                >
                  {file}
                </button>
              ))}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;