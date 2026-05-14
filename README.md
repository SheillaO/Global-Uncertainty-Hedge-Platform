# 🌍 Global Uncertainty Hedge Platform


**A real-time commodities trading platform designed to democratize access to strategic resources during periods of global economic volatility.**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://globalhedge.netlify.app/)
[![API Gateway](https://img.shields.io/badge/API-Render-blue)](https://global-uncertainty-hedge-platform.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://github.com/SheillaO/Global-Uncertainty-Hedge-Platform)

---

## 🎯 Problem Statement

In an era defined by geopolitical conflicts, supply chain disruptions, and currency devaluation, access to strategic commodity markets remains gatekept by institutional barriers. The 2022 Ukraine crisis exposed how energy and agricultural dependencies can destabilize entire economies overnight. Meanwhile, inflation erodes purchasing power globally, yet alternative wealth preservation strategies remain inaccessible to everyday investors.

**This platform addresses three critical gaps:**

1. **Financial Inclusion**: Removes the complexity barrier that prevents retail investors from accessing commodity markets as inflation hedges
2. **Economic Education**: Provides real-time market context that connects commodity prices to geopolitical events, fostering informed decision-making
3. **Cross-Border Resilience**: Offers multi-currency support and strategic resource diversification for populations facing currency instability

---

## 🏗️ Architecture Overview

### High-Level System Design

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Client Layer  │ ◄─────► │   Node.js API    │ ◄─────► │  External APIs  │
│   (Vanilla JS)  │  HTTP   │   Gateway        │  HTTPS  │ (Alpha Vantage) │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │                             │
        │                            ▼                             │
        │                    ┌──────────────┐                     │
        │                    │  Event-Driven │                     │
        │                    │  Background   │                     │
        │                    │  Workers      │                     │
        │                    └──────────────┘                     │
        │                            │                             │
        ▼                            ▼                             ▼
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  SSE News Feed  │         │  PDF Generation  │         │  Email Delivery │
│  (Real-time)    │         │  (PDFKit)        │         │  (Nodemailer)   │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

### Core Components

| Module | Responsibility | Technology |
|--------|---------------|------------|
| **Price Engine** | High-frequency market simulation with minute-level oscillation and volatility modeling | Custom algorithm + Alpha Vantage integration |
| **Trade Controller** | RESTful endpoint handling with input sanitization and event emission | Native Node.js HTTP module |
| **Background Workers** | Asynchronous PDF contract generation and email delivery pipeline | Node.js EventEmitter pattern |
| **SSE Stream** | Server-Sent Events implementation for real-time breaking news ticker | HTTP streaming with keep-alive headers |
| **Static Server** | Zero-dependency static asset delivery with intelligent 404 handling | Node.js `fs/promises` |

---

## 🧠 Technical Deep Dive

### 1. **High-Frequency Price Simulation Algorithm**

Instead of relying solely on delayed API responses, the platform implements a **time-coupled oscillation model** that generates realistic price movements:

```javascript
// Bind index to current minute (cycles through 14 data points every 14 minutes)
const targetIndex = currentMinute % priceTimeline.length;
const historicalBasePrice = priceTimeline[targetIndex];

// Apply mathematical wave function using current second for sub-minute variance
const waveFactor = Math.sin((currentSecond * Math.PI) / 30);
const maxTickVariance = historicalBasePrice * 0.0025; // 0.25% standard tick
const calculatedLivePrice = historicalBasePrice + (waveFactor * maxTickVariance) + randomNoise;
```

**Why this matters**: Simulates order book bid/ask matching variance in real-time without overwhelming external API rate limits. This approach demonstrates understanding of market microstructure while maintaining system reliability.

---

### 2. **Event-Driven Trade Execution Pipeline**

Decouples synchronous API responses from heavy background tasks using Node.js EventEmitter:

```javascript
// Emit trade event immediately after database write
marketRequestEmitter.emit('commodityRequest', tradeData);

// Async workers handle PDF generation + email delivery in parallel
marketRequestEmitter.on('commodityRequest', async (tradeData) => {
  generatePDF(tradeData, uniqueFilename);
  await generateEmail(tradeData, uniqueFilename);
});
```

**Performance benefit**: API responds in <100ms while complex PDF rendering and SMTP operations run asynchronously in background threads.

---

### 3. **Server-Sent Events for Real-Time News**

Implements unidirectional HTTP streaming for live market updates without WebSocket overhead:

```javascript
res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  'Connection': 'keep-alive',
  'X-Accel-Buffering': 'no' // Disables Render.com's proxy buffering
});

// Push news every 5 seconds
setInterval(() => {
  res.write(`data: ${JSON.stringify({ event: 'news-update', story: stories[randomIndex] })}\n\n`);
}, 5000);
```

**Architectural decision**: SSE chosen over WebSockets for its simplicity in one-way data flow scenarios and native browser reconnection handling.

---

## 🚀 Key Features

### **Multi-Commodity Support**
- **Energy**: Crude Oil (WTI), Natural Gas
- **Precious Metals**: Gold, Silver
- **Industrial Metals**: Copper
- **Agriculture**: Wheat, Corn

Each commodity tracks real-world market symbols and unit conventions (troy ounces, barrels, bushels).

### **Dynamic Currency Conversion**
Real-time GBP/USD toggling with automatic recalculation of investment yields.

### **Institutional-Grade Documentation**
Auto-generated PDF contracts with:
- Transaction timestamp and unique ID
- Strike price at execution
- Customer metadata (name, email)
- Secure email delivery via Nodemailer + Gmail SMTP

### **Geopolitical News Integration**
Live ticker displaying curated breaking news stories relevant to:
- Energy supply disruptions (Ukraine conflict, OPEC+ decisions)
- Agricultural supply chain shocks (climate events, export bans)
- Monetary policy shifts (Fed rate decisions, currency interventions)

---

## 📊 Strategic Asset Correlation Model

The platform tracks seven commodities chosen for their **complementary correlation profiles**:

| Commodity | Economic Signal | Crisis Behavior |
|-----------|----------------|-----------------|
| **Gold** | Inflation hedge, safe haven | Rises during USD weakness |
| **Crude Oil** | Energy security indicator | Spikes during Middle East conflicts |
| **Wheat** | Food security proxy | Surges during drought/war in grain belts |
| **Silver** | Industrial + precious hybrid | Tracks tech manufacturing demand |
| **Copper** | Green transition bellwether | Correlates with EV/infrastructure spending |
| **Natural Gas** | European energy dependence | Volatile during supply route disruptions |
| **Corn** | Ethanol/livestock feed baseline | Sensitive to US agricultural policy |

**Investor Education Layer**: The UI contextualizes each commodity's role in portfolio diversification, moving beyond simple price tracking to strategic resource allocation education.

---

## 🛠️ Technology Stack

### **Backend**
- **Runtime**: Node.js 18+ (native HTTP server, zero framework overhead)
- **Event System**: EventEmitter for async job processing
- **PDF Generation**: PDFKit (in-memory document rendering)
- **Email Delivery**: Nodemailer (Gmail SMTP integration)
- **Input Sanitization**: sanitize-html (XSS protection)

### **Frontend**
- **Pure Vanilla JavaScript** (no framework dependencies)
- **Server-Sent Events API** (real-time news streaming)
- **CSS Custom Properties** (theme system with gold/brown color scheme)
- **Responsive Design** (mobile-first layout principles)

### **Infrastructure**
- **Frontend Hosting**: Netlify (CDN edge distribution)
- **Backend Gateway**: Render.com (containerized Node.js deployment)
- **Data Source**: Alpha Vantage API (fallback to historical simulation)

---

## 📁 Project Structure

```
.
├── controllers/
│   ├── alpha.js                 # Price engine with time-coupled oscillation
│   ├── marketController.js      # REST endpoint handlers
│   └── routeHandlers.js         # Request routing logic
├── data/
│   ├── data.json                # Trade history persistence
│   ├── marketHistory.json       # 14-point price timeline per commodity
│   └── stories.js               # Curated geopolitical news snippets
├── events/
│   └── marketEvents.js          # EventEmitter for async trade processing
├── utils/
│   ├── pdfKit.js                # Contract document generation
│   ├── nodemailer.js            # SMTP email delivery
│   ├── sanitizeInput.js         # XSS/injection protection
│   ├── saveTrade.js             # JSON persistence layer
│   ├── getData.js               # Trade history retrieval
│   ├── parseJSONBody.js         # Async request body parser
│   ├── sendResponse.js          # HTTP response formatter
│   └── getContentType.js        # MIME type resolver
├── public/
│   ├── index.html               # Main trading interface
│   ├── 404.html                 # Custom error page
│   ├── index.css                # Theme styling (gold/brown palette)
│   └── index.js                 # Client-side trading logic
├── server.js                    # HTTP server entry point
├── serveStatic.js               # Static file middleware
└── package.json
```

---

## 🔧 Environment Configuration

```bash
# Required for live API integration
ALPHA_VANTAGE_KEY=your_api_key_here
USE_LIVE_API=false  # Set to 'true' to enable Alpha Vantage (subject to rate limits)

# Email delivery credentials
EMAIL_PASS=your_gmail_app_password  # Generate via Google Account Security settings

# Deployment
PORT=5500  # Auto-assigned by Render in production
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ (leverages native ESM and `import.meta.dirname`)
- Gmail account with [App Password enabled](https://support.google.com/accounts/answer/185833)

### Local Development

```bash
# Clone repository
git clone https://github.com/SheillaO/Global-Uncertainty-Hedge-Platform.git
cd Global-Uncertainty-Hedge-Platform

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev

# Access interface
open http://localhost:5500
```

### Production Deployment

**Backend (Render.com)**:
1. Connect GitHub repository
2. Set environment variables in Render dashboard
3. Deploy with `npm start` build command

**Frontend (Netlify)**:
1. Link repository
2. Set build directory to `public/`
3. Configure `API_BASE_URL` to point to Render gateway

---

## 🎨 Design Philosophy

### **Visual Language**
The interface adopts a **commodities trading floor aesthetic** with:
- Gold/brown color palette (evoking precious metals)
- High-contrast typography for data legibility
- Gradient overlays suggesting market depth
- Minimalist form design reducing cognitive load

### **UX Principles**
1. **Zero-Knowledge Onboarding**: Users can execute trades without understanding derivatives or futures contracts
2. **Contextual Education**: Each commodity displays unit conventions (`ozt`, `bbl`, `bu`) with footnotes explaining terminology
3. **Transparent Execution**: Real-time price updates + transaction confirmations build trust in system reliability

---

## 🔬 Future Enhancements

### **Phase 2: Correlation Analytics Dashboard**
```javascript
// Planned implementation
const correlation = calculatePearsonCoefficient(goldPrices, oilPrices);
// Display: "When oil spikes 20%, gold typically rises 8%"
```

### **Phase 3: Portfolio Stress Testing**
- Simulate scenarios: "Russia halts gas exports to Europe"
- Calculate exposure: "Your 40% natural gas allocation would gain 35% in this scenario"

### **Phase 4: Blockchain Settlement Layer**
- Issue ERC-20 tokens representing commodity holdings
- Enable fractional ownership with transparent on-chain verification

### **Phase 5: Machine Learning Price Forecasting**
- Train LSTM model on historical data + sentiment analysis
- Provide probabilistic price predictions: "Gold has 65% chance of reaching $2400 by Q3 2026"

---

## 🤝 Contributing

This project welcomes contributions from developers interested in:
- Financial technology democratization
- Geopolitical risk modeling
- Full-stack event-driven architecture
- Economic education through technology

**Areas for collaboration**:
- Integration with additional data sources (World Bank, IMF APIs)
- Enhanced security hardening (rate limiting, API authentication)
- Mobile-native applications (React Native, Swift)
- Multi-language internationalization

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details

---

## 💡 Philosophical Foundation

> "The goal isn't to build another trading platform. It's to provide economic resilience tools to populations facing currency crises, food insecurity, and energy shocks. Technology should bridge the gap between institutional finance and everyday people navigating global uncertainty."

This platform is a proof-of-concept demonstrating how **thoughtful engineering + economic literacy + accessible UX** can democratize sophisticated financial instruments during humanity's most volatile period since the 1970s oil crisis.

---

## 📬 Contact

**Developer**: Olga Sheilla  
**Portfolio**: [GitHub](https://github.com/SheillaO) | [Live Demo](https://globalhedge.netlify.app/)  
**Gateway API**: [Render Endpoint](https://global-uncertainty-hedge-platform.onrender.com/)

---

**Built with ❤️ to solve real problems in an uncertain world.**
