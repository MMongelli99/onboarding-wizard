import { useState, useEffect } from "react";
import { getDatabaseTables } from "../services";
import type { Database } from "../../types/database";

export default function DatabaseViewer() {
  const [data, setData] = useState<Database | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDatabaseTables({
      onSuccess: (data) => setData(data as Database),
      onError: (errMsg) => setError(errMsg),
    });
  }, []);

  return error ? (
    <div className="p-8 text-white text-center">
      Failed to load data: {error}
    </div>
  ) : data ? (
    <div className="p-8 space-y-12 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Database Tables</h1>
      {Object.entries(data).map(([tableName, tableData]) => {
        const columnNames = tableData.columns;
        const rows = tableData.rows;
        return (
          <div key={tableName}>
            <h2 className="text-xl font-semibold mb-2">{tableName}</h2>
            <div className="overflow-auto rounded border border-gray-700">
              <table className="min-w-full table-auto bg-gray-800 text-sm">
                <thead className="bg-gray-700">
                  <tr>
                    {columnNames.map((columnName, colIdx) => (
                      <th
                        key={colIdx}
                        className="px-4 py-2 border-b border-gray-600 text-left font-medium"
                      >
                        {columnName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length ? (
                    rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="even:bg-gray-800 odd:bg-gray-850 hover:bg-gray-700"
                      >
                        {columnNames.map((columnName, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="px-4 py-2 border-b border-gray-600"
                          >
                            {String(row[columnName] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columnNames.length}
                        className="px-4 py-2 border-b border-gray-600 text-center text-gray-400"
                      >
                        No rows in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="p-8 text-white text-center">Loading database tables...</div>
  );
}
