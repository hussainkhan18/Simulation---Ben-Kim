# Strategic Crisis Simulation Platform

A stateful, stochastic, AI-assisted decision simulation platform that trains users to make decisions under uncertainty. Built as a portfolio piece demonstrating systems thinking, behavioral economics, and decision theory integration.

## 🎯 Project Overview

This platform simulates real-world crisis scenarios (starting with supply chain disruptions) where users must navigate uncertainty, manage risk, and make strategic decisions with incomplete information. Each simulation generates unique scenarios with randomized parameters and stochastic events.

### Key Features

- **Infinite Scenario Variations**: Procedurally generated scenarios with randomized parameters
- **Stochastic Event System**: Probabilistic disruptions that mirror real-world uncertainty
- **Behavioral Analysis**: Detects decision-making biases (loss aversion, recency bias, etc.)
- **Counterfactual Analysis**: Shows optimal strategy vs. actual performance
- **Real-time State Management**: Tracks cascading effects of each decision
- **Deep Feedback Engine**: Comprehensive post-simulation analysis

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │  React + Tailwind
│   (Port 3000)   │  Chat-style UI
└────────┬────────┘
         │
         │ REST API
         │
┌────────▼────────┐
│   Backend       │  Node.js + Express
│   (Port 3001)   │  Simulation Engine
└────────┬────────┘
         │
         │
┌────────▼────────┐
│   Database      │  PostgreSQL
│   (Supabase)    │  Persistent Memory
└─────────────────┘
```

### Core Modules

1. **Scenario Generator**: Creates randomized crisis situations
2. **Event Engine**: Injects probabilistic disruptions
3. **Decision Processor**: Calculates consequences with hidden variables
4. **State Manager**: Tracks KPIs and system state
5. **Feedback Engine**: Analyzes performance and behavior patterns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- Git

### 1. Clone or Copy Files

You should have the following structure:

```
project/
├── server.js           # Backend server
├── package.json        # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── database/
    └── schema.sql
```

### 2. Backend Setup

```bash
# Install backend dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3001
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development
EOF

# Start backend server
npm start
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start frontend
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Database Setup (Supabase - Recommended)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Copy and paste the contents of `database/schema.sql`
5. Run the query
6. Copy your connection string from Settings > Database
7. Add to backend `.env` file

## 🎮 How to Use

1. **Start Simulation**: Click "Start Simulation" to generate a unique crisis scenario
2. **Review Situation**: Read the scenario description and current KPIs
3. **Make Decisions**: Choose from 6 available actions, each with different costs and tradeoffs
4. **Observe Consequences**: Watch immediate, secondary, and tradeoff effects unfold
5. **Navigate Events**: React to random events that inject additional complexity
6. **Complete Simulation**: Run ends after 7 turns or bankruptcy/stabilization
7. **Review Feedback**: Analyze detailed performance report with bias detection and optimal strategy comparison

## 🧠 Decision Options

| Action | Cost | Primary Effect |
|--------|------|----------------|
| Diversify Suppliers | $45M | Reduce supply chain risk (+resilience, -margins) |
| Increase Inventory | $35M | Buffer against disruptions (+safety, +carrying costs) |
| Negotiate Contracts | $15M | Improve margins (+profit, -supplier trust) |
| Emergency Airlift | $60M | Immediate inventory replenishment (expensive) |
| Reduce Exposure | Reputation | Lower risk by reducing commitments (-market share) |
| Do Nothing | None | Maintain status quo (risk accumulates) |

## 📊 Scoring System

Final score is calculated based on:

- **Survival (40%)**: Did the company avoid bankruptcy?
- **Reputation (25%)**: Customer satisfaction and brand strength
- **Risk Management (20%)**: How well was uncertainty managed?
- **Efficiency (15%)**: Resource utilization and inventory management

Performance tiers:
- **Optimal**: 75-100 points
- **Adequate**: 50-74 points  
- **Suboptimal**: 0-49 points

## 🔬 What Makes This Different

This isn't a game with predetermined outcomes or a static case study. It's a **decision training environment** that:

1. **Generates infinite unique scenarios** (no two runs are the same)
2. **Models hidden variables** (market confidence, political pressure, supplier trust)
3. **Creates realistic tradeoffs** (every decision has costs and benefits)
4. **Tracks behavioral patterns** (identifies cognitive biases)
5. **Provides optimization analysis** (shows path to better outcomes)

## 🎓 Educational Value

Demonstrates understanding of:

- **Systems Thinking**: Modeling interconnected variables and feedback loops
- **Behavioral Economics**: Bias detection and decision pattern analysis
- **Stochastic Modeling**: Probabilistic events and uncertainty quantification
- **Full-Stack Development**: React frontend, Node.js backend, PostgreSQL database
- **UX Design**: Clean, professional interface for complex information

## 📈 Future Enhancements

Potential additions (not in MVP):

- [ ] Multiple scenario types (financial crisis, geopolitical risk, etc.)
- [ ] Multiplayer mode (collaborative decision-making)
- [ ] AI opponent (compete against algorithmic decision-maker)
- [ ] Historical data analysis (track improvement over time)
- [ ] Custom scenario builder
- [ ] LLM-powered narrative generation
- [ ] Real-time market simulation
- [ ] Mobile app version

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Custom CSS (no heavy frameworks)
- Fetch API for HTTP requests

**Backend:**
- Node.js with Express
- UUID for session management
- CORS enabled

**Database:**
- PostgreSQL
- JSONB for flexible state storage
- Supabase for hosting

**Deployment:**
- Frontend: Vercel (recommended)
- Backend: Railway or Render
- Database: Supabase

## 📝 API Endpoints

### `POST /api/start`
Initializes a new simulation session
```json
{
  "userId": "optional-user-id"
}
```

### `POST /api/turn`
Processes a decision and returns consequences
```json
{
  "sessionId": "uuid",
  "decision": {
    "action": "diversify_suppliers"
  }
}
```

### `POST /api/end`
Finalizes simulation and generates feedback report
```json
{
  "sessionId": "uuid"
}
```

### `GET /api/health`
Health check endpoint

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome. If you'd like to extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this as a learning resource or portfolio template.

## 👤 Author

**Alex**
- Carnegie Mellon University Student
- Applying to MBA Programs (Michigan Ross)
- Former ROK Army Squad Leader
- Email: [Your Email]

## 🙏 Acknowledgments

Built as part of MBA application portfolio to demonstrate:
- Technical capability
- Systems thinking
- Product design
- Decision science application

---

**Note**: This is a portfolio piece designed to show capability in building decision training systems. It demonstrates understanding of complex system modeling, behavioral analysis, and full-stack development.
