import { useEffect, useState } from "react";

type TableData = Record<string, any[]>;

export default function DatabaseViewer() {
  const [data, setData] = useState<TableData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="p-8 text-red-500 text-center">
        Failed to load data: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-white text-center">
        Loading database contents...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Database Tables</h1>

      {Object.entries(data).map(([tableName, rows]) => (
        <div key={tableName}>
          <h2 className="text-xl font-semibold mb-2">{tableName}</h2>

          {rows.length === 0 ? (
            <p className="italic text-gray-400">No rows in this table.</p>
          ) : (
            <div className="overflow-auto rounded border border-gray-700">
              <table className="min-w-full table-auto bg-gray-800 text-sm">
                <thead className="bg-gray-700">
                  <tr>
                    {Object.keys(rows[0]).map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2 border-b border-gray-600 text-left font-medium"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      className="even:bg-gray-800 odd:bg-gray-850 hover:bg-gray-700"
                    >
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="px-4 py-2 border-b border-gray-700"
                        >
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
