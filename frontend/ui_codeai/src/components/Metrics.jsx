import { useState, useEffect } from 'react';
import metricsService from '../services/metricsService';

const Metrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo data when services aren't available
  const demoMetrics = [
    { developer: 'Alice Johnson', commits: 42 },
    { developer: 'Bob Smith', commits: 38 },
    { developer: 'Carol Williams', commits: 35 },
    { developer: 'David Brown', commits: 28 },
    { developer: 'Emily Davis', commits: 22 },
    { developer: 'Frank Miller', commits: 18 },
    { developer: 'Grace Wilson', commits: 15 }
  ];

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await metricsService.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
      // Use demo data when services aren't available
      // setMetrics(demoMetrics);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Error loading metrics</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const sortedMetrics = [...metrics].sort((a, b) => b.commits - a.commits);
  const totalCommits = metrics.reduce((sum, m) => sum + (m.commits || 0), 0);
  const maxCommits = Math.max(...metrics.map(m => m.commits), 1);

  return (
    <div className="space-y-6">
      {metrics.length > 0 && metrics[0].developer === demoMetrics[0].developer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">
              {/* <strong>Demo Mode:</strong> Backend services aren't configured. Showing demo data. Configure your database to see real metrics. */}
            </p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Developer Metrics</h2>
          <p className="text-sm text-gray-600 mt-2">
            Track commit activity and developer performance
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
              <div className="flex items-center">
                <svg className="w-10 h-10 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <p className="text-sm opacity-90">Active Developers</p>
                  <p className="text-3xl font-bold">{metrics.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
              <div className="flex items-center">
                <svg className="w-10 h-10 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm opacity-90">Total Commits</p>
                  <p className="text-3xl font-bold">{totalCommits}</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
              <div className="flex items-center">
                <svg className="w-10 h-10 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div>
                  <p className="text-sm opacity-90">Avg Commits/Dev</p>
                  <p className="text-3xl font-bold">
                    {metrics.length > 0 ? Math.round(totalCommits / metrics.length) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Commit Activity</h3>
            {sortedMetrics.map((metric, index) => (
              <div key={metric.developer} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{metric.developer}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{metric.commits}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-linear-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(metric.commits / maxCommits) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {sortedMetrics.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-4 text-gray-600">No metrics available yet</p>
              <p className="text-sm text-gray-500">Start analyzing repositories to see metrics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Metrics;

