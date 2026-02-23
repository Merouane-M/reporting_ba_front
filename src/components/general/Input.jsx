function Input({ id, label, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>

      <input
        id={id}
        className={`border p-2 w-full rounded 
          ${error ? "border-red-500 bg-red-50" : "border-sofiblue"}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {error && (
        <p className="text-red-600 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input