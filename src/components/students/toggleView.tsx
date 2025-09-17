export default function ToggleView({ view, onChange }: { view: "cards" | "table"; onChange: (v: "cards" | "table") => void }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange("cards")} className={`px-3 py-1 rounded ${view === "cards" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Cards</button>
      <button onClick={() => onChange("table")} className={`px-3 py-1 rounded ${view === "table" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Table</button>
    </div>
  );
}
