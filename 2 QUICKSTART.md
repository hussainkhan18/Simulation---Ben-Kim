# Quick Start Guide - Local Testing

Get your Crisis Simulation Platform running locally in 5 minutes.

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check npm
npm --version

# If you don't have Node.js 18+, download from nodejs.org
```

---

## Step 1: Install Backend Dependencies

```bash
# In project root directory
npm install
```

This installs:
- express (web server)
- cors (cross-origin requests)
- uuid (session IDs)

---

## Step 2: Start Backend (No Database Needed for Testing!)

```bash
# In project root directory
npm start
```

You should see:
```
🚀 Crisis Simulation Engine running on port 3001
```

**Leave this terminal window open!**

---

## Step 3: Install Frontend Dependencies

Open a **NEW terminal window** (keep backend running):

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install
```

This installs:
- react
- react-dom
- react-scripts

---

## Step 4: Start Frontend

```bash
# In frontend directory (same terminal as Step 3)
npm start
```

Your browser should automatically open to `http://localhost:3000`

If not, manually visit: **http://localhost:3000**

---

## Step 5: Test the Simulation

1. **Click "Start Simulation"**
   - Should load a unique crisis scenario
   - See 5 KPI cards at top
   - See scenario description in chat

2. **Make a Decision**
   - Click any of the 6 action buttons
   - See consequences appear in chat
   - Watch KPIs update

3. **Continue for 3-5 Turns**
   - Keep making decisions
   - Random events may trigger
   - Watch how state evolves

4. **View Feedback Report**
   - After 7 turns (or if you go bankrupt)
   - See final score
   - Review decision timeline
   - Check bias analysis
   - Compare to optimal strategy

---

## Troubleshooting

### Backend won't start

**Error: "Cannot find module 'express'"**
```bash
# Solution: Install dependencies
npm install
```

**Error: "Port 3001 is already in use"**
```bash
# Solution: Kill existing process
# Mac/Linux:
lsof -ti:3001 | xargs kill -9

# Windows:
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F
```

---

### Frontend won't start

**Error: "Cannot find module 'react'"**
```bash
# Solution: Make sure you're in frontend directory
cd frontend
npm install
```

**Error: "Port 3000 is already in use"**
```bash
# Solution: Use different port
# React will ask: "Would you like to run on another port?"
# Press Y
```

---

### Can't connect to backend

**Error: "Failed to fetch" in browser console**

**Check:**
1. Is backend running? (Check terminal - should say "running on port 3001")
2. Open http://localhost:3001/api/health in browser
3. Should see: `{"status":"ok","sessions":0}`

If health check fails:
```bash
# Restart backend
# Press Ctrl+C in backend terminal
npm start
```

---

## What Each File Does

```
project/
├── server.js          → Backend API (scenario generator, decision engine)
├── package.json       → Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js     → Main React component (UI logic)
│   │   ├── App.css    → Styling (gradient backgrounds, cards)
│   │   ├── index.js   → React entry point
│   │   └── index.css  → Global styles
│   │
│   ├── public/
│   │   └── index.html → HTML template
│   │
│   └── package.json   → Frontend dependencies
│
└── database/
    └── schema.sql     → Database structure (not needed for local testing)
```

---

## Testing Checklist

Run through this to verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend opens in browser
- [ ] Can click "Start Simulation"
- [ ] Scenario loads with description
- [ ] Can see 5 KPI cards (cash, inventory, reputation, risk, diversification)
- [ ] Can click decision buttons
- [ ] Consequences appear in chat
- [ ] KPIs update after decisions
- [ ] Random events sometimes trigger (🚨 icon)
- [ ] Simulation completes after 7 turns
- [ ] Feedback report shows final score
- [ ] Can see decision timeline
- [ ] Can see bias analysis (if any detected)
- [ ] Can see optimal strategy comparison
- [ ] "Run New Simulation" button works

---

## Quick Test Scenarios

### Test 1: Normal Play
- Make balanced decisions
- Complete 7 turns
- Check if score is 50-75 (adequate)

### Test 2: Aggressive Play
- Choose "Emergency Airlift" and "Increase Inventory" repeatedly
- Should run out of cash quickly
- Simulation ends early (bankruptcy)

### Test 3: Passive Play
- Choose "Do Nothing" multiple times
- Should see bias detection: "Loss Aversion"
- Risk level should increase
- Lower final score

### Test 4: Random Event Triggering
- Play multiple simulations
- Should see different events:
  - Port closures
  - Supplier failures
  - Demand spikes
  - Currency shocks
- Not every simulation has events (they're probabilistic)

---

## Performance Check

Your app should:

✅ Start simulation in < 1 second
✅ Process decisions in < 500ms
✅ Generate feedback report in < 1 second
✅ Support multiple simultaneous users (each gets unique session)

---

## Ready for Next Steps?

Once local testing works:

1. **Add database**: Follow `database/schema.sql` instructions
2. **Deploy to production**: Follow `DEPLOYMENT.md`
3. **Customize scenarios**: Edit `generateNarrative()` in `server.js`
4. **Add more events**: Extend `injectEvent()` array
5. **Tune scoring**: Modify `evaluateSimulation()` logic

---

## Quick Commands Reference

```bash
# Start backend (from project root)
npm start

# Start frontend (from frontend/ directory)
cd frontend
npm start

# Stop servers
# Press Ctrl+C in each terminal

# Restart everything
# Ctrl+C both servers, then:
npm start              # in root
cd frontend && npm start  # in another terminal
```

---

## Need Help?

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "Module not found" | Run `npm install` in correct directory |
| "Port in use" | Kill existing process or use different port |
| "Cannot connect" | Check both servers are running |
| "Blank screen" | Check browser console for errors |

**Still stuck?**
- Check `server.js` for syntax errors
- Check `frontend/src/App.js` for syntax errors
- Verify you're in correct directory when running commands

---

## Success!

If you can:
1. ✅ Start a simulation
2. ✅ Make decisions
3. ✅ See consequences
4. ✅ Complete simulation
5. ✅ View feedback report

**You're ready to deploy or customize!**

Next steps:
- Read `DEPLOYMENT.md` for production deployment
- Read `PORTFOLIO_GUIDE.md` for MBA application strategy
- Read `README.md` for full documentation

---

**Time to working app: ~5 minutes** ⚡️
