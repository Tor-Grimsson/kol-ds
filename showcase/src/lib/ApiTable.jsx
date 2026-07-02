/**
 * ApiTable — the standard props table (Prop / Type / Default / Description).
 * Shared by component pages and the Docs pages.
 */
export default function ApiTable({ rows }) {
  if (!rows?.length) return null
  return (
    <div className="overflow-x-auto rounded-[var(--kol-radius-md)] border border-fg-12">
      <table className="w-full text-left kol-sans-body-02">
        <thead>
          <tr className="border-b border-fg-12 text-meta">
            {['Prop', 'Type', 'Default', 'Description'].map((h) => (
              <th key={h} className="px-4 py-2.5 kol-helper-10 font-normal uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.prop} className="border-b border-fg-08 align-top last:border-0">
              <td className="whitespace-nowrap px-4 py-3 kol-mono-12 text-emphasis">{r.prop}</td>
              <td className="px-4 py-3 kol-mono-12 text-meta">{r.type}</td>
              <td className="whitespace-nowrap px-4 py-3 kol-mono-12 text-meta">{r.def}</td>
              <td className="px-4 py-3 text-body">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
