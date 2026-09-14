import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { urlService } from '../services/url.service';
import { UrlItem } from '../types';
import {
  Check,
  Copy,
  ExternalLink,
  Link2,
  LogOut,
  MousePointerClick,
  Plus,
  Trash2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logoutState } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [shortening, setShortening] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const data = await urlService.getUserUrls();
      setUrls(data);
    } catch (err: any) {
      setError('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setError('');
    setShortening(true);

    try {
      const newUrl = await urlService.shortenUrl(originalUrl);
      setUrls((prev) => [newUrl, ...prev]);
      setOriginalUrl('');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to shorten URL. Make sure it starts with http:// or https://',
      );
    } finally {
      setShortening(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;

    try {
      await urlService.deleteUrl(id);
      setUrls((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete URL');
    }
  };

  const handleCopy = (id: string, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = async () => {
    await authService.logout();
    logoutState();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Link2 className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              ShortLink
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:inline">
              Welcome, <span className="text-slate-900 font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Shortener Card */}
        <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Shorten a Long URL</h2>
          <p className="text-sm text-slate-500 mb-6">
            Paste your long URL below to generate a compact, trackable short link.
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url-path"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-800"
            />
            <button
              type="submit"
              disabled={shortening}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 min-w-[140px]"
            >
              {shortening ? (
                <span>Shortening...</span>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Shorten URL</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* URLs Table/List */}
        <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Your Shortened URLs</h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-full">
              Total: {urls.length}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading URLs...</div>
          ) : urls.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Link2 className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="font-medium text-slate-600">No URLs shortened yet</p>
              <p className="text-xs text-slate-400">Use the form above to shorten your first link!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6">Original URL</th>
                    <th className="py-3.5 px-6">Short Link</th>
                    <th className="py-3.5 px-6 text-center">Clicks</th>
                    <th className="py-3.5 px-6">Created</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {urls.map((url) => (
                    <tr key={url.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 max-w-xs truncate text-slate-700 font-mono text-xs">
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline hover:text-blue-600"
                          title={url.originalUrl}
                        >
                          {url.originalUrl}
                        </a>
                      </td>

                      <td className="py-4 px-6 font-medium text-blue-600">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 hover:underline"
                        >
                          <span>{url.shortUrl}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-xs">
                          <MousePointerClick className="h-3.5 w-3.5 text-slate-500" />
                          <span>{url.clicks}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-500">
                        {new Date(url.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleCopy(url.id, url.shortUrl)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Copy short link"
                        >
                          {copiedId === url.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(url.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
