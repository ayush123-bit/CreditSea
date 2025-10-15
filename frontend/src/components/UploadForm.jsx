import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const onFileChange = (e) => {
    setMessage(null);
    const f = e.target.files?.[0];
    setFile(f || null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile(f);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!file) {
      setMessage({ type: 'error', text: 'Please choose an XML file to upload.' });
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'xml' && ext !== 'txt') {
      setMessage({ type: 'error', text: 'Please upload an XML (or .txt) file.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage({ type: 'success', text: 'File uploaded and parsed successfully.' });
      
      // Navigate to report view
      setTimeout(() => {
        if (data && data.reportId) {
          navigate(`/reports/${data.reportId}`);
        } else {
          navigate('/reports');
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || 'Upload failed';
      setMessage({ type: 'error', text: msg });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 transition-all duration-200 ${
          dragActive
            ? 'border-sky-500 bg-sky-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
      >
        <input
          id="file"
          type="file"
          accept=".xml,.txt,application/xml,text/xml"
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center text-center">
          {/* Upload Icon */}
          <div className={`mb-4 p-4 rounded-full transition-colors ${
            dragActive ? 'bg-sky-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
              dragActive ? 'text-sky-600' : 'text-gray-500'
            }`} />
          </div>

          {/* Text */}
          <div className="mb-2">
            <p className="text-base sm:text-lg font-semibold text-gray-700 mb-1">
              {dragActive ? 'Drop your file here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500">
              XML or TXT files only
            </p>
          </div>

          {/* Supported Formats */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              CIBIL
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              Experian
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              CRIF
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              Equifax
            </span>
          </div>
        </div>
      </div>

      {/* Selected File Display */}
      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-sky-100 rounded-lg flex-shrink-0">
              <FileText className="w-5 h-5 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setMessage(null);
                document.getElementById('file').value = '';
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={uploading || !file}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload & Parse</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setFile(null);
            setMessage(null);
            document.getElementById('file').value = '';
          }}
          disabled={uploading}
          className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}
    </form>
  );
}
