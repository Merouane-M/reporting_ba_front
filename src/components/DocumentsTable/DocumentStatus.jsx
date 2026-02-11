// DocumentStatus.jsx
function DocumentStatus({ status }) {
  // Mapping status → colors and labels
  const statusMap = {
    VALIDATED: { label: "Validé", bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-800" },
    IN_PROCESS: { label: "En cours", bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-800" },
    SENT: { label: "Envoyé", bg: "bg-green-100", text: "text-green-800", dot: "bg-green-800" },
  };

  const { label, bg, text, dot } = statusMap[status] || {
    label: "Inconnu",
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-800",
  };

  return (
    <span
      className={`flex flex-row items-center justify-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${bg} ${text}`}
    >
      <div className={`h-2 w-2 rounded-full ${dot}`}></div>
      {label}
    </span>
  );
}

export default DocumentStatus;
