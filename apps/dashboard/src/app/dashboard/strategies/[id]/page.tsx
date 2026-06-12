"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface Strategy {
  id: string;
  name: string;
  description: string | null;
  type: string;
  config: Record<string, unknown>;
  tags: string[];
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
}

interface Version {
  id: string;
  version_number: number;
  changelog: string | null;
  created_at: string;
}

export default function StrategyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVersions, setShowVersions] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const id = params.id as string;

  const fetchStrategy = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strategies/${id}`,
        { headers: { "X-User-Id": "00000000-0000-0000-0000-000000000001" } }
      );
      if (!res.ok) throw new Error("Not found");
      setStrategy(await res.json());
    } catch {
      router.push("/dashboard/strategies");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const fetchVersions = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strategies/${id}/versions`,
        { headers: { "X-User-Id": "00000000-0000-0000-0000-000000000001" } }
      );
      if (res.ok) setVersions(await res.json());
    } catch {
      // ignore
    }
  }, [id]);

  useEffect(() => {
    fetchStrategy();
  }, [fetchStrategy]);

  const handleDelete = async () => {
    if (!confirm("Delete this strategy?")) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/strategies/${id}`,
        {
          method: "DELETE",
          headers: { "X-User-Id": "00000000-0000-0000-0000-000000000001" },
        }
      );
      if (res.ok) router.push("/dashboard/strategies");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">
        Loading...
      </div>
    );
  }

  if (!strategy) return null;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/strategies"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            &larr; Strategies
          </Link>
          <h1 className="text-2xl font-bold text-zinc-100 mt-1">{strategy.name}</h1>
          {strategy.description && (
            <p className="text-sm text-zinc-500 mt-1">{strategy.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/strategies/new`}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => { setShowVersions(!showVersions); if (!showVersions) fetchVersions(); }}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Versions
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1.5 text-sm rounded-lg border border-red-900/50 text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4">
          <span className="text-xs text-zinc-500 uppercase">Type</span>
          <p className="text-sm text-zinc-200 mt-1 capitalize">{strategy.type}</p>
        </div>
        <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4">
          <span className="text-xs text-zinc-500 uppercase">Status</span>
          <p className="text-sm text-zinc-200 mt-1 capitalize">{strategy.status}</p>
        </div>
        <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4">
          <span className="text-xs text-zinc-500 uppercase">Version</span>
          <p className="text-sm text-zinc-200 mt-1">v{strategy.version}</p>
        </div>
      </div>

      {strategy.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {strategy.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Strategy Config
          </h3>
        </div>
        <pre className="p-4 text-xs text-zinc-400 font-mono overflow-auto max-h-96">
          {JSON.stringify(strategy.config, null, 2)}
        </pre>
      </div>

      {showVersions && (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Version History
            </h3>
          </div>
          <div className="divide-y divide-zinc-800">
            {versions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-zinc-500">No versions found</div>
            ) : (
              versions.map((v) => (
                <div key={v.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-zinc-200">v{v.version_number}</span>
                    {v.changelog && (
                      <p className="text-xs text-zinc-500 mt-0.5">{v.changelog}</p>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500">
                    {new Date(v.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
