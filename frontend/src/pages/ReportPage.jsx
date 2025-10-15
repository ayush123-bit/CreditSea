
// src/pages/ReportPage.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import ReportDisplay from '../components/ReportDisplay';
import { useParams, Link } from 'react-router-dom';
import { shortId } from '../utils/formatData';
import { 
  FileText, Upload, TrendingUp, ChevronRight, 
  Loader2, AlertCircle, Search, ArrowLeft
} from 'lucide-react';

export default function ReportPage() {
  const { id } = useParams();
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        if (id) {
          const { data } = await API.get(`/reports/${id}`);
          setActiveReport(data);
        } else {
          const { data } = await API.get('/reports');
          setReports(data);
          if (data && data.length > 0) setActiveReport(data[0]);
        }
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || err.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [id]);

  const filteredReports = reports.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.pan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.sourceFileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Credit Reports
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  View and manage your credit reports
                </p>
              </div>
            </div>
            <Link
              to="/upload"
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload New</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              {/* Sidebar Header */}
              <div className="p-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Saved Reports
                  </h2>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
                    {reports.length}
                  </span>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>

              {/* Reports List */}
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                {loading && (
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading...</p>
                  </div>
                )}
                
                {error && (
                  <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {!loading && filteredReports.length === 0 && (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">
                      {searchTerm ? 'No matching reports found' : 'No reports found'}
                    </p>
                    <Link
                      to="/upload"
                      className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Upload your first report
                    </Link>
                  </div>
                )}

                <ul className="divide-y divide-gray-100">
                  {filteredReports.map((r) => (
                    <li key={r._id}>
                      <button
                        onClick={() => {
                          setActiveReport(r);
                          window.history.pushState({}, '', `/reports/${r._id}`);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left p-4 transition-colors hover:bg-sky-50 ${
                          activeReport?._id === r._id ? 'bg-sky-50 border-l-4 border-sky-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {r.name || 'Unknown'}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 truncate mb-2">
                              {r.sourceFileName || 'uploaded file'}
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-gray-400" />
                                <span className="text-xs font-medium text-gray-600">
                                  {r.creditScore ?? '—'}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                #{shortId(r._id)}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Report Header */}
              {activeReport && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {activeReport.name || 'Credit Report'}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>ID: {shortId(activeReport._id)}</span>
                        <span>•</span>
                        <span>{activeReport.sourceFileName || 'Unknown file'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-4" />
                  <p className="text-gray-500">Loading report...</p>
                </div>
              )}

              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}

              {!loading && !error && !activeReport && (
                <div className="flex flex-col items-center justify-center py-20">
                  <FileText className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg font-medium mb-2">No report selected</p>
                  <p className="text-gray-400 text-sm">Select a report from the sidebar to view details</p>
                </div>
              )}

              {!loading && !error && activeReport && (
                <ReportDisplay report={activeReport} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}