# 🏦 CreditSea - Credit Report Parser

<div align="center">

![CreditSea Banner](https://img.shields.io/badge/CreditSea-Credit%20Report%20Parser-0EA5E9?style=for-the-badge&logo=creditcard&logoColor=white)

A modern, secure web application for parsing and analyzing credit bureau XML reports from CIBIL, Experian, CRIF, and Equifax.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=netlify)](https://musical-rabanadas-ba6d4c.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/ayush123-bit/CreditSea)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [XML Format Support](#-xml-format-support)
- [Screenshots](#-screenshots)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

**CreditSea** is a comprehensive credit report parsing solution that allows users to upload XML files from various credit bureaus and instantly receive a beautifully formatted, easy-to-understand credit report analysis.

### Why CreditSea?

- 🔒 **Secure & Private** - Your data is processed securely without permanent storage
- 🚀 **Multi-Format Support** - Works with CIBIL, Experian, CRIF, and Equifax XML formats
- ⚡ **Instant Analysis** - Get results in seconds with our intelligent parser
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Beautiful, intuitive interface with real-time feedback

---

## ✨ Features

### Core Features

- **📤 Drag & Drop Upload** - Intuitive file upload with drag-and-drop support
- **🔍 Smart XML Parser** - Automatically detects and parses multiple XML formats
- **📊 Comprehensive Reports** - Displays all essential credit information
- **💳 Account Analysis** - Detailed breakdown of all credit accounts
- **📈 Credit Score Display** - Prominent credit score with rating (Excellent/Good/Fair/Poor)
- **🔎 Search & Filter** - Easy search through saved reports
- **📱 Mobile Responsive** - Fully optimized for all screen sizes

### Report Details

CreditSea extracts and displays:

- ✅ **Basic Details**: Name, Mobile Phone, PAN, Credit Score
- ✅ **Report Summary**: Total accounts, active/closed accounts, current balance
- ✅ **Financial Overview**: Secured/unsecured amounts, recent enquiries
- ✅ **Credit Accounts**: Detailed information for each credit card and loan
  - Account type and status
  - Bank/lender information
  - Account numbers
  - Credit limits and balances
  - Overdue amounts
  - Payment history
  - Account addresses

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **xml2js** - XML to JavaScript parser
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ayush123-bit/CreditSea.git
cd CreditSea
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/creditsea
NODE_ENV=development
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start MongoDB**

```bash
# If using local MongoDB
mongod
```

6. **Start the Backend Server**

```bash
cd backend
npm run dev
```

7. **Start the Frontend Development Server**

```bash
cd frontend
npm start
```

8. **Open your browser**

Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 📁 Project Structure

```
CreditSea/
├── backend/
│   ├── controllers/
│   │   └── reportController.js    # API logic
│   ├── models/
│   │   └── Report.js               # MongoDB schema
│   ├── routes/
│   │   └── reports.js              # API routes
│   ├── utils/
│   │   └── parseXML.js             # XML parsing logic
│   ├── uploads/                     # Temporary file storage
│   ├── server.js                    # Express server setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js              # Axios configuration
│   │   ├── components/
│   │   │   ├── UploadForm.jsx      # File upload component
│   │   │   └── ReportDisplay.jsx   # Report display component
│   │   ├── pages/
│   │   │   ├── UploadPage.jsx      # Upload page
│   │   │   └── ReportPage.jsx      # Report viewing page
│   │   ├── utils/
│   │   │   └── formatData.js       # Data formatting utilities
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # Entry point
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### 1. Upload XML File

**POST** `/upload`

Upload and parse a credit report XML file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field

**Response:**
```json
{
  "message": "File uploaded and parsed successfully",
  "reportId": "65abc123def456789",
  "report": {
    "name": "John Doe",
    "creditScore": 750,
    "reportSummary": { ... },
    "creditAccounts": [ ... ]
  }
}
```

#### 2. Get All Reports

**GET** `/reports`

Retrieve all saved credit reports.

**Response:**
```json
[
  {
    "_id": "65abc123def456789",
    "name": "John Doe",
    "creditScore": 750,
    "pan": "ABCDE1234F",
    "sourceFileName": "credit_report.xml",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### 3. Get Report by ID

**GET** `/reports/:id`

Retrieve a specific credit report by ID.

**Response:**
```json
{
  "_id": "65abc123def456789",
  "name": "John Doe",
  "mobilePhone": "9876543210",
  "pan": "ABCDE1234F",
  "creditScore": 750,
  "reportSummary": {
    "totalAccounts": 5,
    "activeAccounts": 3,
    "closedAccounts": 2,
    "currentBalanceAmount": 250000,
    "securedAmount": 150000,
    "unsecuredAmount": 100000,
    "last7DaysEnquiries": 2
  },
  "creditAccounts": [ ... ],
  "rawParsed": { ... }
}
```

---

## 🔧 XML Format Support

CreditSea automatically detects and parses XML reports from:

### Supported Formats

| Bureau | Format | Status |
|--------|--------|--------|
| **CIBIL** | TransUnion CIBIL Format | ✅ Fully Supported |
| **Experian** | Experian Credit Report | ✅ Fully Supported |
| **CRIF High Mark** | CRIF Format | ✅ Fully Supported |
| **Equifax** | Equifax Format | ✅ Fully Supported |
| **Generic** | Unknown/Custom Formats | 🟡 Best Effort |

### XML Structure Examples

#### CIBIL Format
```xml
<INProfileResponse>
  <SCORE>
    <BureauScore>750</BureauScore>
  </SCORE>
  <CAIS_Account>
    <CAIS_Account_DETAILS>
      <!-- Account details -->
    </CAIS_Account_DETAILS>
  </CAIS_Account>
</INProfileResponse>
```

The parser intelligently handles:
- Different XML structures
- Various field naming conventions (camelCase, snake_case)
- Missing or optional fields
- Arrays vs single objects
- Multiple date formats

---

📸 Screenshots
Upload Page
<p align="center"> <img src="https://github.com/user-attachments/assets/10328041-e4ca-416f-8856-e87a49281cd5" width="800" alt="Upload Page Screenshot"> </p>

Beautiful drag-and-drop interface with multi-bureau support

Credit Score Display
<p align="center"> <img src="https://github.com/user-attachments/assets/7655f09c-b334-42af-ba9f-ec8dc8b033a7" width="800" alt="Credit Score Section"> </p>

Prominent credit score display with rating

Report Summary
<p align="center"> <img src="https://github.com/user-attachments/assets/085cfcdf-a8c4-4c4e-9d64-8b309dcb7037" width="800" alt="Report Summary"> </p>

Comprehensive account summary with visual stats

Account Details
<p align="center"> <img src="https://github.com/user-attachments/assets/3cf5f3b5-803b-4bc8-9f86-d90a6e383c19" width="800" alt="Account Details Section"> </p>

Detailed breakdown of all credit accounts
---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/creditsea` |
| `NODE_ENV` | Environment (development/production) | `development` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 🌐 Deployment

### Frontend Deployment (Netlify)

The frontend is deployed on Netlify at: [https://musical-rabanadas-ba6d4c.netlify.app/](https://musical-rabanadas-ba6d4c.netlify.app/)

**Steps:**

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy to Netlify:
```bash
netlify deploy --prod
```

### Backend Deployment Options

#### Option 1: Heroku

```bash
cd backend
heroku create creditsea-api
git push heroku main
```

#### Option 2: Railway

1. Create a new project on [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Add MongoDB plugin
4. Deploy

#### Option 3: DigitalOcean App Platform

1. Create a new app on DigitalOcean
2. Connect your repository
3. Configure build settings
4. Deploy

### Environment Variables for Production

Update frontend `.env` with production API URL:
```env
VITE_API_URL=https://your-backend-api.com/api
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 🐛 Known Issues & Limitations

- ⚠️ Large XML files (>10MB) may take longer to process
- ⚠️ Some custom XML formats may not be fully supported
- ⚠️ File upload requires valid XML structure

---

## 🗺️ Roadmap

- [ ] Add PDF export functionality
- [ ] Implement user authentication
- [ ] Add credit score trends over time
- [ ] Support for more international credit bureaus
- [ ] Email notifications for report generation
- [ ] Advanced analytics and insights
- [ ] Comparison between multiple reports
- [ ] Mobile app (React Native)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Contact

**Ayush** - [@ayush123-bit](https://github.com/ayush123-bit)

Project Link: [https://github.com/ayush123-bit/CreditSea](https://github.com/ayush123-bit/CreditSea)

Live Demo: [https://musical-rabanadas-ba6d4c.netlify.app/](https://musical-rabanadas-ba6d4c.netlify.app/)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Lucide Icons](https://lucide.dev/) - Icon Library
- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Backend Framework
- [Netlify](https://www.netlify.com/) - Hosting Platform

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by [Ayush](https://github.com/ayush123-bit)

</div>
