// src/pages/UploadPage.jsx
import React from 'react';
import UploadForm from '../components/UploadForm';
import { FileText, Shield, Zap } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Credit Report Parser
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Upload your credit bureau XML file for instant analysis
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-lg border border-sky-200">
              <Shield className="w-5 h-5 text-sky-600" />
              <span className="text-sm font-medium text-sky-700">
                Secure & Private
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <FileText className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Multi-Format</p>
                <p className="text-xs text-gray-500">All bureaus supported</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Instant Parse</p>
                <p className="text-xs text-gray-500">Results in seconds</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Secure</p>
                <p className="text-xs text-gray-500">Your data is safe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Upload Your Credit Report
            </h2>
            <p className="text-sm text-gray-600">
              Select an XML file from any credit bureau (CIBIL, Experian, CRIF, or Equifax)
            </p>
          </div>

          <UploadForm />
        </div>

        {/* How It Works Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            How It Works
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Upload Your File</p>
                <p className="text-sm text-gray-600 mt-1">
                  Drag and drop or click to select your XML credit report file
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Automatic Processing</p>
                <p className="text-sm text-gray-600 mt-1">
                  Our system automatically detects the format and extracts all relevant information
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">View Your Report</p>
                <p className="text-sm text-gray-600 mt-1">
                  Get instant access to a comprehensive, easy-to-read credit report analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> Your uploaded files are processed securely and are not stored permanently on our servers. 
            We respect your privacy and handle all data with the highest security standards.
          </p>
        </div>
      </div>
    </div>
  );
}