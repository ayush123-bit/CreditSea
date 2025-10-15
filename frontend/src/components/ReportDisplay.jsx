// src/components/ReportDisplay.jsx
import React from 'react';
import { formatCurrency } from '../utils/formatData';
import { 
  User, Phone, CreditCard, TrendingUp, Briefcase, 
  DollarSign, ShieldCheck, ShieldAlert, Calendar,
  Building, MapPin, AlertCircle, CheckCircle
} from 'lucide-react';

export default function ReportDisplay({ report }) {
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-500">No report to display.</p>
      </div>
    );
  }

  const raw = report.rawParsed || {};
  const holderDetails = raw.CAIS_Holder_Details || {};
  const phoneDetails = raw.CAIS_Holder_Phone_Details || {};
  const summary = raw.CAIS_Summary || {};
  const score = raw.SCORE || {};
  const accountsRaw = raw.CAIS_Account || {};
  const accountsArr = Array.isArray(accountsRaw.CAIS_Account_DETAILS) 
    ? accountsRaw.CAIS_Account_DETAILS 
    : accountsRaw.CAIS_Account_DETAILS 
      ? [accountsRaw.CAIS_Account_DETAILS] 
      : [];

  // Map basic fields
  const name = [
    holderDetails.First_Name_Non_Normalized, 
    holderDetails.Middle_Name_1_Non_Normalized, 
    holderDetails.Surname_Non_Normalized
  ]
    .filter(Boolean)
    .join(' ') || '—';

  const mobilePhone = phoneDetails.Telephone_Number || phoneDetails.Mobile_Telephone_Number || '—';
  const pan = raw.CAIS_Holder_ID_Details?.find(id => id?.ID_Type === 'PAN')?.ID_Number || '—';
  const creditScore = score.BureauScore || '—';
  const scoreConfidence = score.BureauScoreConfidLevel || '—';

  // Map report summary
  const reportSummary = {
    totalAccounts: accountsArr.length,
    activeAccounts: accountsArr.filter(a => a.Account_Status === '11' || a.Account_Status === '71').length,
    closedAccounts: accountsArr.filter(a => a.Account_Status === '13').length,
    currentBalanceAmount: parseFloat(summary.Total_Outstanding_Balance?.Outstanding_Balance_All || 0),
    securedAmount: parseFloat(summary.Total_Outstanding_Balance?.Outstanding_Balance_Secured || 0),
    unsecuredAmount: parseFloat(summary.Total_Outstanding_Balance?.Outstanding_Balance_UnSecured || 0),
    last7DaysEnquiries: parseInt(raw.TotalCAPS_Summary?.TotalCAPSLast7Days || 0)
  };

  // Get score color
  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 750) return 'text-green-600 bg-green-50 border-green-200';
    if (numScore >= 650) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreRating = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 750) return 'Excellent';
    if (numScore >= 700) return 'Good';
    if (numScore >= 650) return 'Fair';
    return 'Poor';
  };

  // Map credit accounts
  const creditAccounts = accountsArr.map(a => {
    const holderAddr = a.CAIS_Holder_Address_Details || {};
    const addressParts = [
      holderAddr.First_Line_Of_Address_non_normalized,
      holderAddr.Second_Line_Of_Address_non_normalized,
      holderAddr.City_non_normalized,
      holderAddr.ZIP_Postal_Code_non_normalized
    ].filter(Boolean);
    
    return {
      type: getAccountType(a.Account_Type),
      typeCode: a.Account_Type,
      bank: a.Subscriber_Name?.trim() || '—',
      accountNumber: a.Account_Number || '—',
      amountOverdue: parseFloat(a.Amount_Past_Due || 0),
      currentBalance: parseFloat(a.Current_Balance || 0),
      creditLimit: parseFloat(a.Credit_Limit_Amount || 0),
      status: getAccountStatus(a.Account_Status),
      openDate: formatDate(a.Open_Date),
      dateReported: formatDate(a.Date_Reported),
      address: addressParts.join(', ') || '—',
      paymentRating: a.Payment_Rating || '0'
    };
  });

  return (
    <div className="space-y-6">
      {/* Credit Score Hero Section */}
      <section className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <p className="text-sm font-medium opacity-90">Credit Score</p>
            </div>
            <div className="flex items-baseline justify-center sm:justify-start gap-3">
              <h2 className="text-5xl sm:text-6xl font-bold">{creditScore}</h2>
              {creditScore !== '—' && (
                <span className="text-lg font-medium opacity-90">
                  / 900
                </span>
              )}
            </div>
            {creditScore !== '—' && (
              <p className="mt-2 text-sm opacity-90">
                Rating: <span className="font-semibold">{getScoreRating(creditScore)}</span>
                {scoreConfidence !== '—' && ` • Confidence: ${scoreConfidence}`}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" />
                <p className="text-xs font-medium">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Details */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-sky-600" />
          Basic Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard icon={<User className="w-5 h-5" />} label="Name" value={name} />
          <InfoCard icon={<Phone className="w-5 h-5" />} label="Mobile" value={mobilePhone} />
          <InfoCard icon={<CreditCard className="w-5 h-5" />} label="PAN" value={pan} />
          <InfoCard 
            icon={<TrendingUp className="w-5 h-5" />} 
            label="Credit Score" 
            value={creditScore}
            highlight={creditScore !== '—'}
          />
        </div>
      </section>

      {/* Report Summary */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-sky-600" />
          Account Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Total Accounts" 
            value={reportSummary.totalAccounts}
            icon={<Briefcase className="w-5 h-5" />}
            color="blue"
          />
          <StatCard 
            label="Active" 
            value={reportSummary.activeAccounts}
            icon={<CheckCircle className="w-5 h-5" />}
            color="green"
          />
          <StatCard 
            label="Closed" 
            value={reportSummary.closedAccounts}
            icon={<AlertCircle className="w-5 h-5" />}
            color="gray"
          />
          <StatCard 
            label="Enquiries (7d)" 
            value={reportSummary.last7DaysEnquiries}
            icon={<TrendingUp className="w-5 h-5" />}
            color="purple"
          />
          <StatCard 
            label="Total Balance" 
            value={formatCurrency(reportSummary.currentBalanceAmount)}
            icon={<DollarSign className="w-5 h-5" />}
            color="blue"
            large
          />
          <StatCard 
            label="Secured" 
            value={formatCurrency(reportSummary.securedAmount)}
            icon={<ShieldCheck className="w-5 h-5" />}
            color="green"
          />
          <StatCard 
            label="Unsecured" 
            value={formatCurrency(reportSummary.unsecuredAmount)}
            icon={<ShieldAlert className="w-5 h-5" />}
            color="orange"
          />
        </div>
      </section>

      {/* Credit Accounts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-600" />
            Credit Accounts
          </h3>
          <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm font-semibold rounded-full">
            {creditAccounts.length}
          </span>
        </div>

        {creditAccounts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No credit accounts found in the report.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {creditAccounts.map((account, idx) => (
              <AccountCard key={idx} account={account} index={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Helper Components
function InfoCard({ icon, label, value, highlight }) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-sky-50 border-sky-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className={`flex items-center gap-2 mb-2 ${highlight ? 'text-sky-600' : 'text-gray-600'}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={`text-base font-bold ${highlight ? 'text-sky-900' : 'text-gray-900'} truncate`}>
        {value}
      </p>
    </div>
  );
}

function StatCard({ label, value, icon, color = 'blue', large = false }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[color]} ${large ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium opacity-80">{label}</span>
        <div className="opacity-60">{icon}</div>
      </div>
      <p className="text-lg font-bold truncate">
        {value === undefined || value === null || value === '' ? '—' : value}
      </p>
    </div>
  );
}

function AccountCard({ account, index }) {
  const isOverdue = account.amountOverdue > 0;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Building className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{account.bank}</h4>
            <p className="text-sm text-gray-500">{account.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            account.status === 'Active' || account.status === 'Current'
              ? 'bg-green-100 text-green-700'
              : account.status === 'Closed'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {account.status}
          </span>
          {isOverdue && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
              Overdue
            </span>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <AccountField label="Account #" value={account.accountNumber} />
        <AccountField label="Credit Limit" value={formatCurrency(account.creditLimit)} />
        <AccountField label="Current Balance" value={formatCurrency(account.currentBalance)} highlight />
        <AccountField label="Amount Overdue" value={formatCurrency(account.amountOverdue)} alert={isOverdue} />
        <AccountField label="Payment Rating" value={account.paymentRating === '1' ? 'Good' : account.paymentRating} />
      </div>

      {/* Dates */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Opened: {account.openDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Reported: {account.dateReported}</span>
        </div>
      </div>

      {/* Address */}
      {account.address !== '—' && (
        <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-100 p-3 rounded">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{account.address}</span>
        </div>
      )}
    </div>
  );
}

function AccountField({ label, value, highlight, alert }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-sm font-semibold ${
        alert ? 'text-red-600' : highlight ? 'text-sky-600' : 'text-gray-900'
      } truncate`}>
        {value ?? '—'}
      </div>
    </div>
  );
}

// Helper Functions
function getAccountType(code) {
  const types = {
    '10': 'Credit Card',
    '51': 'Personal Loan',
    '52': 'Personal Loan',
    '01': 'Home Loan',
    '05': 'Auto Loan',
    '06': 'Two Wheeler Loan',
    '07': 'Education Loan'
  };
  return types[code] || `Type ${code}`;
}

function getAccountStatus(code) {
  const statuses = {
    '11': 'Active',
    '13': 'Closed',
    '53': 'Written Off',
    '71': 'Active'
  };
  return statuses[code] || 'Unknown';
}

function formatDate(dateStr) {
  if (!dateStr || dateStr.length !== 8) return '—';
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${day}/${month}/${year}`;
}
