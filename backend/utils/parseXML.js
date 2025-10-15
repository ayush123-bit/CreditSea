// backend/utils/parseXML.js
const xml2js = require('xml2js');

const parser = new xml2js.Parser({
  explicitArray: false,
  ignoreAttrs: false,
  explicitRoot: false,
  mergeAttrs: true,
  trim: true
});

/**
 * Helper: safely get the first item or string value
 */
function firstOrValue(v) {
  if (v === undefined || v === null) return undefined;
  if (Array.isArray(v)) return v[0];
  return v;
}

/**
 * Convert numeric-like to Number (fallback to 0)
 */
function toNumber(val) {
  if (val === undefined || val === null || val === '') return 0;
  const n = Number(String(val).replace(/[^0-9.-]+/g, ''));
  return isNaN(n) ? 0 : n;
}

/**
 * Format date from various formats to readable format
 */
function formatDate(dateStr) {
  if (!dateStr) return dateStr;
  
  // Handle YYYYMMDD format (CIBIL)
  if (typeof dateStr === 'string' && dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${day}/${month}/${year}`;
  }
  
  // Handle YYYY-MM-DD format
  if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  
  // Handle DD/MM/YYYY or DD-MM-YYYY
  if (typeof dateStr === 'string' && dateStr.match(/^\d{2}[/-]\d{2}[/-]\d{4}/)) {
    return dateStr.replace(/-/g, '/');
  }
  
  return dateStr;
}

/**
 * Deep search for a value in nested object by key name
 */
function deepSearch(obj, keyName, maxDepth = 5, currentDepth = 0) {
  if (!obj || typeof obj !== 'object' || currentDepth > maxDepth) return undefined;
  
  // Check if key exists at current level
  if (obj[keyName] !== undefined) return obj[keyName];
  
  // Search in nested objects
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const result = deepSearch(obj[key], keyName, maxDepth, currentDepth + 1);
      if (result !== undefined) return result;
    }
  }
  
  return undefined;
}

/**
 * Try multiple key variations to find a value
 */
function tryKeys(obj, keyNames) {
  for (const key of keyNames) {
    const value = deepSearch(obj, key, 3);
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return undefined;
}

/**
 * Get account type description
 */
function getAccountTypeDescription(code) {
  const types = {
    '10': 'Credit Card',
    '51': 'Personal Loan',
    '52': 'Personal Loan',
    '01': 'Home Loan',
    '02': 'Housing Loan',
    '03': 'Property Loan',
    '04': 'Loan Against Property',
    '05': 'Auto Loan',
    '06': 'Two Wheeler Loan',
    '07': 'Education Loan',
    '08': 'Gold Loan',
    '09': 'Business Loan',
    '32': 'Commercial Vehicle Loan',
    '33': 'Overdraft',
    '35': 'Secured Credit Card',
    '36': 'Consumer Loan',
    '37': 'Prime Minister Jaan Dhan Yojana',
    '38': 'Mudra Loans - Shishu',
    '39': 'Mudra Loans - Kishor'
  };
  return types[String(code)] || `Account Type ${code}`;
}

/**
 * Get account status description
 */
function getAccountStatus(code) {
  const statuses = {
    '11': 'Active',
    '13': 'Closed',
    '53': 'Written Off',
    '71': 'Active',
    '82': 'Settled',
    '83': 'Post (WO) Settled',
    '84': 'Wilful Default'
  };
  return statuses[String(code)] || `Status ${code}`;
}

/**
 * Detect XML format type
 */
function detectFormat(parsed) {
  if (parsed.INProfileResponse) return 'CIBIL';
  if (parsed.CreditReport || parsed.CREDITREPORT) return 'EXPERIAN';
  if (parsed.CRIF || parsed.HighMark) return 'CRIF_HIGHMARK';
  if (parsed.Equifax || parsed.EQUIFAX) return 'EQUIFAX';
  return 'GENERIC';
}

/**
 * Extract from CIBIL format
 */
function extractCIBIL(root) {
  const out = {
    name: undefined,
    mobilePhone: undefined,
    pan: undefined,
    creditScore: undefined,
    reportSummary: {
      totalAccounts: 0,
      activeAccounts: 0,
      closedAccounts: 0,
      currentBalanceAmount: 0,
      securedAmount: 0,
      unsecuredAmount: 0,
      last7DaysEnquiries: 0,
      raw: {}
    },
    creditAccounts: []
  };

  // Extract Basic Details
  const currentApp = root.Current_Application?.Current_Application_Details;
  if (currentApp) {
    const applicantDetails = currentApp.Current_Applicant_Details;
    if (applicantDetails) {
      const firstName = applicantDetails.First_Name || '';
      const lastName = applicantDetails.Last_Name || '';
      out.name = `${firstName} ${lastName}`.trim();
      out.mobilePhone = applicantDetails.MobilePhoneNumber || '';
      out.pan = applicantDetails.IncomeTaxPan || '';
    }
  }

  // Extract Credit Score
  const scoreSection = root.SCORE;
  if (scoreSection) {
    out.creditScore = toNumber(scoreSection.BureauScore);
  }

  // Extract Report Summary
  const caisSummary = root.CAIS_Account?.CAIS_Summary;
  if (caisSummary) {
    const creditAccount = caisSummary.Credit_Account || {};
    const outstandingBalance = caisSummary.Total_Outstanding_Balance || {};
    
    out.reportSummary.totalAccounts = toNumber(creditAccount.CreditAccountTotal);
    out.reportSummary.activeAccounts = toNumber(creditAccount.CreditAccountActive);
    out.reportSummary.closedAccounts = toNumber(creditAccount.CreditAccountClosed);
    out.reportSummary.currentBalanceAmount = toNumber(outstandingBalance.Outstanding_Balance_All);
    out.reportSummary.securedAmount = toNumber(outstandingBalance.Outstanding_Balance_Secured);
    out.reportSummary.unsecuredAmount = toNumber(outstandingBalance.Outstanding_Balance_UnSecured);
    out.reportSummary.raw = caisSummary;
  }

  const capsSection = root.TotalCAPS_Summary;
  if (capsSection) {
    out.reportSummary.last7DaysEnquiries = toNumber(capsSection.TotalCAPSLast7Days);
  }

  // Extract Credit Accounts
  let accountDetails = root.CAIS_Account?.CAIS_Account_DETAILS;
  if (accountDetails) {
    if (!Array.isArray(accountDetails)) {
      accountDetails = [accountDetails];
    }

    accountDetails.forEach((account) => {
      const holderDetails = account.CAIS_Holder_Details || {};
      const addressDetails = account.CAIS_Holder_Address_Details || {};
      const idDetails = account.CAIS_Holder_ID_Details;
      
      let pan = out.pan;
      if (idDetails) {
        const idDetail = Array.isArray(idDetails) ? idDetails[0] : idDetails;
        pan = idDetail?.Income_TAX_PAN || pan;
      }
      
      const addressParts = [
        addressDetails.First_Line_Of_Address_non_normalized,
        addressDetails.Second_Line_Of_Address_non_normalized,
        addressDetails.Third_Line_Of_Address_non_normalized,
        addressDetails.City_non_normalized,
        addressDetails.ZIP_Postal_Code_non_normalized
      ].filter(Boolean);
      const address = addressParts.join(', ');

      const accountTypeCode = account.Account_Type;
      const accountStatusCode = account.Account_Status;
      const portfolioType = account.Portfolio_Type;
      
      const creditAccount = {
        type: getAccountTypeDescription(accountTypeCode),
        accountTypeCode: accountTypeCode,
        portfolioType: portfolioType === 'R' ? 'Revolving' : 'Installment',
        bank: (account.Subscriber_Name || '').trim(),
        accountNumber: account.Account_Number || '',
        accountStatus: getAccountStatus(accountStatusCode),
        accountStatusCode: accountStatusCode,
        openDate: formatDate(account.Open_Date),
        dateReported: formatDate(account.Date_Reported),
        dateClosed: formatDate(account.Date_Closed),
        creditLimit: toNumber(account.Credit_Limit_Amount),
        highestCreditAmount: toNumber(account.Highest_Credit_or_Original_Loan_Amount),
        currentBalance: toNumber(account.Current_Balance),
        amountOverdue: toNumber(account.Amount_Past_Due),
        paymentRating: account.Payment_Rating || '',
        paymentHistory: account.Payment_History_Profile || '',
        address: address,
        holderName: `${holderDetails.First_Name_Non_Normalized || ''} ${holderDetails.Surname_Non_Normalized || ''}`.trim(),
        pan: pan,
        dateOfBirth: formatDate(holderDetails.Date_of_birth),
        phone: account.CAIS_Holder_Phone_Details?.Telephone_Number || '',
        suitFiled: account.SuitFiled_WilfulDefault === '01' ? 'Yes' : 'No',
        writtenOffStatus: account.Written_off_Settled_Status || '',
        raw: account
      };

      out.creditAccounts.push(creditAccount);
    });
  }

  // Fallback to account holder details if main details missing
  if (!out.name && out.creditAccounts.length > 0) {
    out.name = out.creditAccounts[0].holderName;
  }
  if (!out.pan && out.creditAccounts.length > 0) {
    out.pan = out.creditAccounts[0].pan;
  }
  if (!out.mobilePhone && out.creditAccounts.length > 0) {
    out.mobilePhone = out.creditAccounts[0].phone;
  }

  return out;
}

/**
 * Extract from generic/unknown format using deep search
 */
function extractGeneric(parsed) {
  const out = {
    name: undefined,
    mobilePhone: undefined,
    pan: undefined,
    creditScore: undefined,
    reportSummary: {
      totalAccounts: 0,
      activeAccounts: 0,
      closedAccounts: 0,
      currentBalanceAmount: 0,
      securedAmount: 0,
      unsecuredAmount: 0,
      last7DaysEnquiries: 0,
      raw: {}
    },
    creditAccounts: []
  };

  // Try to find name
  const nameKeys = [
    'Name', 'FullName', 'ConsumerName', 'ApplicantName', 'PersonName',
    'First_Name', 'FirstName', 'Surname', 'Last_Name', 'LastName',
    'GivenName', 'FamilyName'
  ];
  const firstName = tryKeys(parsed, ['First_Name', 'FirstName', 'GivenName']);
  const lastName = tryKeys(parsed, ['Last_Name', 'LastName', 'Surname', 'FamilyName']);
  
  if (firstName || lastName) {
    out.name = `${firstName || ''} ${lastName || ''}`.trim();
  } else {
    out.name = tryKeys(parsed, nameKeys);
  }

  // Try to find mobile phone
  const phoneKeys = [
    'MobilePhoneNumber', 'Mobile', 'Phone', 'MobileNumber', 'ContactNumber',
    'Telephone_Number', 'TelephoneNumber', 'PhoneNumber', 'CellPhone'
  ];
  out.mobilePhone = tryKeys(parsed, phoneKeys);

  // Try to find PAN
  const panKeys = [
    'IncomeTaxPan', 'PAN', 'Income_TAX_PAN', 'TaxID', 'PanNumber', 'PanCard'
  ];
  out.pan = tryKeys(parsed, panKeys);

  // Try to find credit score
  const scoreKeys = [
    'BureauScore', 'CreditScore', 'Score', 'ScoreValue', 'CIBIL_Score',
    'ScoreNumber', 'Rating'
  ];
  const scoreValue = tryKeys(parsed, scoreKeys);
  out.creditScore = toNumber(scoreValue);

  // Try to find report summary data
  const totalAccountsKeys = [
    'CreditAccountTotal', 'TotalAccounts', 'NumberOfAccounts', 'AccountCount', 'TotalNumberOfAccounts'
  ];
  const activeAccountsKeys = [
    'CreditAccountActive', 'ActiveAccounts', 'OpenAccounts', 'ActiveAccountCount'
  ];
  const closedAccountsKeys = [
    'CreditAccountClosed', 'ClosedAccounts', 'ClosedAccountCount'
  ];
  const currentBalanceKeys = [
    'Outstanding_Balance_All', 'TotalOutstanding', 'CurrentBalance', 'TotalBalance', 'OutstandingAmount'
  ];
  const securedKeys = [
    'Outstanding_Balance_Secured', 'SecuredAmount', 'SecuredBalance'
  ];
  const unsecuredKeys = [
    'Outstanding_Balance_UnSecured', 'UnsecuredAmount', 'UnsecuredBalance'
  ];
  const enquiriesKeys = [
    'TotalCAPSLast7Days', 'EnquiriesLast7Days', 'RecentEnquiries', 'Enquiries7Days'
  ];

  out.reportSummary.totalAccounts = toNumber(tryKeys(parsed, totalAccountsKeys));
  out.reportSummary.activeAccounts = toNumber(tryKeys(parsed, activeAccountsKeys));
  out.reportSummary.closedAccounts = toNumber(tryKeys(parsed, closedAccountsKeys));
  out.reportSummary.currentBalanceAmount = toNumber(tryKeys(parsed, currentBalanceKeys));
  out.reportSummary.securedAmount = toNumber(tryKeys(parsed, securedKeys));
  out.reportSummary.unsecuredAmount = toNumber(tryKeys(parsed, unsecuredKeys));
  out.reportSummary.last7DaysEnquiries = toNumber(tryKeys(parsed, enquiriesKeys));

  // Try to find account details
  const accountsKeys = [
    'CAIS_Account_DETAILS', 'Account', 'Accounts', 'CreditAccount', 'CreditAccounts',
    'Tradeline', 'Tradelines', 'AccountDetails', 'LoanAccount'
  ];
  
  let accounts = undefined;
  for (const key of accountsKeys) {
    accounts = deepSearch(parsed, key, 4);
    if (accounts) break;
  }

  if (accounts) {
    if (!Array.isArray(accounts)) {
      accounts = [accounts];
    }

    accounts.forEach((account) => {
      // Try to extract account information using common field names
      const type = tryKeys(account, [
        'Account_Type', 'AccountType', 'Type', 'Product', 'AccountCategory', 'LoanType'
      ]);
      
      const bank = tryKeys(account, [
        'Subscriber_Name', 'Bank', 'Lender', 'Institution', 'FinancialInstitution', 'Issuer'
      ]);
      
      const accountNumber = tryKeys(account, [
        'Account_Number', 'AccountNumber', 'Number', 'AccountNo', 'LoanAccountNumber'
      ]);
      
      const status = tryKeys(account, [
        'Account_Status', 'AccountStatus', 'Status', 'State'
      ]);
      
      const currentBalance = tryKeys(account, [
        'Current_Balance', 'CurrentBalance', 'Balance', 'OutstandingBalance', 'PrincipalOutstanding'
      ]);
      
      const amountOverdue = tryKeys(account, [
        'Amount_Past_Due', 'AmountOverdue', 'PastDue', 'OverdueAmount', 'DelinquentAmount'
      ]);
      
      const creditLimit = tryKeys(account, [
        'Credit_Limit_Amount', 'CreditLimit', 'Limit', 'SanctionedAmount'
      ]);

      // Try to get address
      let address = '';
      const addressKeys = ['Address', 'BillingAddress', 'ContactAddress', 'CAIS_Holder_Address_Details'];
      const addressObj = tryKeys(account, addressKeys);
      
      if (typeof addressObj === 'string') {
        address = addressObj;
      } else if (addressObj && typeof addressObj === 'object') {
        const addrParts = Object.values(addressObj).filter(v => v && typeof v === 'string');
        address = addrParts.join(', ');
      }

      const creditAccount = {
        type: type ? (typeof type === 'string' ? type : getAccountTypeDescription(type)) : 'Unknown',
        accountTypeCode: type,
        bank: bank ? String(bank).trim() : '',
        accountNumber: accountNumber || '',
        accountStatus: status ? (typeof status === 'string' ? status : getAccountStatus(status)) : '',
        currentBalance: toNumber(currentBalance),
        amountOverdue: toNumber(amountOverdue),
        creditLimit: toNumber(creditLimit),
        address: address,
        raw: account
      };

      out.creditAccounts.push(creditAccount);
    });
  }

  return out;
}

/**
 * Main extraction function with format detection
 */
function extractData(parsed) {
  const format = detectFormat(parsed);
  
  let result;
  
  switch (format) {
    case 'CIBIL':
      result = extractCIBIL(parsed.INProfileResponse || parsed);
      break;
    
    case 'EXPERIAN':
    case 'CRIF_HIGHMARK':
    case 'EQUIFAX':
    case 'GENERIC':
    default:
      // Use generic extraction with deep search
      result = extractGeneric(parsed);
      break;
  }
  
  // Add format info
  result.detectedFormat = format;
  result.rawParsed = parsed;
  
  return result;
}

/**
 * parseXmlString: parse xml string -> normalized data object
 */
async function parseXmlString(xmlStr) {
  try {
    const parsed = await parser.parseStringPromise(xmlStr);
    return extractData(parsed);
  } catch (error) {
    throw new Error(`XML Parsing Error: ${error.message}`);
  }
}

/**
 * Get summary statistics for credit accounts
 */
function getAccountsSummary(creditAccounts) {
  const summary = {
    totalCreditCards: 0,
    totalLoans: 0,
    totalActiveAccounts: 0,
    totalClosedAccounts: 0,
    totalOverdueAmount: 0,
    totalCurrentBalance: 0,
    accountsWithOverdue: 0
  };

  creditAccounts.forEach(account => {
    // Count by type
    if (account.accountTypeCode === '10' || 
        (typeof account.type === 'string' && account.type.toLowerCase().includes('credit card'))) {
      summary.totalCreditCards++;
    } else {
      summary.totalLoans++;
    }

    // Count by status
    const status = String(account.accountStatus).toLowerCase();
    if (status.includes('active')) {
      summary.totalActiveAccounts++;
    } else if (status.includes('closed')) {
      summary.totalClosedAccounts++;
    }

    // Sum amounts
    summary.totalOverdueAmount += account.amountOverdue || 0;
    summary.totalCurrentBalance += account.currentBalance || 0;

    if ((account.amountOverdue || 0) > 0) {
      summary.accountsWithOverdue++;
    }
  });

  return summary;
}

module.exports = { 
  parseXmlString,
  getAccountsSummary,
  detectFormat: (xmlStr) => {
    return parser.parseStringPromise(xmlStr)
      .then(parsed => detectFormat(parsed));
  }
};