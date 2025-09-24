"use client"

import { StorableObject } from "@/structs/StorableObject"
import { useState, useEffect } from "react"



export default function StorePage() {
  const [blocks, setBlocks] = useState<StorableObject[]>([])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<StorableObject | null>(null)

  useEffect(() => {
    // fetch blocks from API
    fetch("/api/blocks")
      .then((res) => res.json())
      .then((data) => setBlocks(data))
  }, [])

  const filtered = blocks.filter(
    (b) =>
      b.Name.toLowerCase().includes(search.toLowerCase()) ||
      b.Description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logic Block Store</h1>
        <a href="/login" className="text-blue-600 underline">
          Login
        </a>
      </div>

      <input
        type="text"
        placeholder="Search by name or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      <div className="grid gap-4">
        {filtered.map((Step) => (
          <div
            key={Step.Id}
            className="p-4 border rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{Step.Name}</h2>
              <p className="text-gray-600">{Step.Description}</p>
              <span className="text-sm text-purple-600">Type: {Step.Type}</span>
            </div>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => setSelected(Step)}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-2">{selected.Name}</h2>
            <p className="mb-2">{selected.Description}</p>
            <p className="text-sm mb-4">Type: {selected.Type}</p>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto mb-4">
              {selected.Code}
            </pre>
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
