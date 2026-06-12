"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Strategy {
  id: string;
  name: string;
  type: string;
  status: string;
  version: number;
  description: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "text-yellow-400 bg-yellow-400/10",
  active: "text-emerald-400 bg-emerald-400/10",
  archived: "text-zinc-500 bg-zinc-500/10",
};

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  const fetchStrategies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strategies?${params}`,
        { headers: { "X-User-Id": "00000000-0000-0000-0000-000000000001" } }
      );
      const data = await res.json();
      setStrategies(data.items ?? []);
      setTotalPages(data.total_pages ?? 1);
    } catch {
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Strategies</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Create and manage your trading strategies
          </p>
        </div>
        <Link
          href="/dashboard/strategies/new"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          New Strategy
        </Link>
      </div>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search strategies..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800">
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">Type</th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">Version</th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-500 text-sm">Loading...</td>
              </tr>
            ) : strategies.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-500 text-sm">No strategies found</td>
              </tr>
            ) : (
              strategies.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/dashboard/strategies/${s.id}`}
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-zinc-200">{s.name}</span>
                    {s.description && (
                      <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{s.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-400 capitalize">{s.type}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.status] ?? ""}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-400">v{s.version}</td>
                  <td className="px-4 py-3 text-sm text-zinc-500">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-50 hover:text-zinc-200 transition-colors"
          >
            Prev
          </button>
          <span className="text-sm text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-50 hover:text-zinc-200 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
