import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { documentTypes } from '../../constants/documents';  

function Sidebar({ isExpanded, isPinned, setIsPinned }) {  
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    let timer;

    if (isExpanded) {
      timer = setTimeout(() => {
        setShowText(true);
      }, 200); 
    } else {
      setShowText(false);
    }

    return () => clearTimeout(timer);
  }, [isExpanded]);

  return (
    <aside className="h-screen flex flex-col">
      {/* Top section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img
            src="/logo-sofinance-white.svg"
            className="h-10 w-10"
            alt="Sofinance logo"
          />

          {showText && (
            <span className="font-semibold text-sm">
              Sofinance reporting
            </span>
          )}
        </div>

        {showText && (
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

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        {showText && (
          <>
            <button
              onClick={() => navigate("/home")}
              className="w-full text-left rounded px-3 py-2 text-sm
                         hover:bg-white/10 transition"
            >
              Accueil
            </button>

            <div className="pt-2 border-t border-white/20 space-y-1">
              {documentTypes.map((doc) => (
                <button
                  key={doc.abbr}  
                  onClick={() => navigate(`/documents/${doc.abbr}`)}  
                  className="w-full text-left rounded px-3 py-2 text-sm
                             hover:bg-white/10 transition"
                >
                  {doc.abbr + " : " + doc.fullName}
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
