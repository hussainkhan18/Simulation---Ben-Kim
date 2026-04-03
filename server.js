const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (will move to PostgreSQL later)
const sessions = new Map();
const userProfiles = new Map();

// ==========================================
// SCENARIO GENERATOR
// ==========================================

function generateScenario() {
  const seed = Math.random();
  
  return {
    id: uuidv4(),
    type: 'supply_chain',
    seed: seed,
    initial_state: {
      cash: randomBetween(200000000, 800000000),
      inventory: randomBetween(80000, 120000),
      reputation: 0.75,
      risk_level: 0.5,
      supplier_diversification: randomBetween(0.3, 0.7),
      margin: 0.15,
      demand: randomBetween(15000, 25000)
    },
    hidden_variables: {
      market_confidence: randomBetween(0.3, 0.8),
      political_pressure: randomBetween(0.4, 0.9),
      supplier_trust: randomBetween(0.5, 0.9),
      economic_volatility: randomBetween(0.2, 0.6)
    },
    narrative: generateNarrative(),
    turn: 0,
    max_turns: 7,
    active_events: []
  };
}

function generateNarrative() {
  const scenarios = [
    {
      title: "Port Congestion Crisis",
      description: "Your company relies on three major Asian suppliers. Recent port congestion has delayed 40% of inbound shipments. Inventory is depleting faster than anticipated, and your largest retail client is threatening to switch suppliers if you can't guarantee delivery.",
      context: "You have $500M in cash reserves, 95,000 units in inventory, and current demand is 18,000 units/week."
    },
    {
      title: "Supplier Bankruptcy Warning",
      description: "Intelligence reports suggest your primary supplier (40% of volume) is facing financial difficulties. Switching suppliers mid-quarter will cost $50M and reduce margins by 8% for two quarters. However, a supplier failure would halt 40% of production immediately.",
      context: "You have $650M in cash reserves, 88,000 units in inventory, and growing demand of 21,000 units/week."
    },
    {
      title: "Currency Volatility Shock",
      description: "The yuan has depreciated 12% against the dollar in two weeks. Your suppliers are requesting price renegotiations, threatening a 15% cost increase. Alternative suppliers exist but require 6-month onboarding and upfront investment.",
      context: "You have $420M in cash reserves, 110,000 units in inventory, and stable demand of 19,000 units/week."
    }
  ];
  
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==========================================
// EVENT ENGINE
// ==========================================

function injectEvent(state, turn) {
  const events = [
    {
      id: 'port_closure',
      name: 'Major Port Closure',
      probability: 0.25,
      impact: (s) => ({
        inventory: s.inventory * 0.85,
        risk_level: Math.min(s.risk_level + 0.2, 1.0),
        description: 'A major port has closed due to labor strikes. Inventory flow disrupted.'
      })
    },
    {
      id: 'supplier_failure',
      name: 'Supplier Default',
      probability: 0.20,
      impact: (s) => ({
        inventory: s.inventory * 0.75,
        cash: s.cash - 30000000,
        risk_level: Math.min(s.risk_level + 0.25, 1.0),
        description: 'One of your secondary suppliers has defaulted on contracts. Emergency sourcing required.'
      })
    },
    {
      id: 'demand_spike',
      name: 'Unexpected Demand Surge',
      probability: 0.18,
      impact: (s) => ({
        demand: s.demand * 1.4,
        reputation: Math.max(s.reputation - 0.1, 0),
        description: 'Market demand has surged 40%. Can you fulfill orders?'
      })
    },
    {
      id: 'currency_shock',
      name: 'Currency Devaluation',
      probability: 0.15,
      impact: (s) => ({
        cash: s.cash * 0.92,
        margin: s.margin * 0.88,
        description: 'Currency markets have shifted. Your costs just increased 8%.'
      })
    },
    {
      id: 'regulatory_change',
      name: 'New Trade Restrictions',
      probability: 0.12,
      impact: (s) => ({
        supplier_diversification: s.supplier_diversification * 0.7,
        cash: s.cash - 20000000,
        description: 'New trade restrictions limit your supplier options. Compliance costs applied.'
      })
    }
  ];
  
  // Only inject events after turn 1, with increasing probability
  if (turn > 0 && Math.random() < 0.4 + (turn * 0.05)) {
    const eligibleEvents = events.filter(e => Math.random() < e.probability);
    if (eligibleEvents.length > 0) {
      return eligibleEvents[0];
    }
  }
  
  return null;
}

// ==========================================
// DECISION ENGINE
// ==========================================

function processDecision(state, decision, hiddenVars) {
  const newState = { ...state };
  const consequences = {
    immediate: [],
    secondary: [],
    tradeoffs: []
  };
  
  switch(decision.action) {
    case 'diversify_suppliers':
      newState.cash -= 45000000;
      newState.supplier_diversification = Math.min(newState.supplier_diversification + 0.25, 1.0);
      newState.risk_level = Math.max(newState.risk_level - 0.15, 0);
      newState.margin *= 0.92;
      hiddenVars.supplier_trust += 0.1;
      
      consequences.immediate.push('Invested $45M in supplier diversification');
      consequences.secondary.push('Supply chain resilience improved significantly');
      consequences.tradeoffs.push('Short-term margins reduced by 8%');
      break;
      
    case 'increase_inventory':
      const cost = 35000000;
      if (newState.cash >= cost) {
        newState.cash -= cost;
        newState.inventory += 25000;
        newState.risk_level += 0.05;
        
        consequences.immediate.push('Purchased 25,000 additional units ($35M)');
        consequences.secondary.push('Buffer against disruption created');
        consequences.tradeoffs.push('Increased carrying costs and capital tied up');
      } else {
        consequences.immediate.push('Insufficient cash for inventory purchase');
      }
      break;
      
    case 'negotiate_contracts':
      newState.cash -= 15000000;
      newState.margin += 0.03;
      hiddenVars.supplier_trust -= 0.05;
      
      consequences.immediate.push('Renegotiated supplier contracts ($15M cost)');
      consequences.secondary.push('Improved margins by 3%');
      consequences.tradeoffs.push('Supplier relationships slightly strained');
      break;
      
    case 'do_nothing':
      newState.risk_level += 0.08;
      hiddenVars.market_confidence -= 0.05;
      
      consequences.immediate.push('Maintained current operations');
      consequences.secondary.push('No proactive risk mitigation taken');
      consequences.tradeoffs.push('Exposure to disruption increased');
      break;
      
    case 'emergency_airlift':
      const airCost = 60000000;
      if (newState.cash >= airCost) {
        newState.cash -= airCost;
        newState.inventory += 15000;
        newState.reputation += 0.1;
        newState.margin *= 0.85;
        
        consequences.immediate.push('Emergency air shipment secured ($60M)');
        consequences.secondary.push('Customer commitments met, reputation protected');
        consequences.tradeoffs.push('Extremely high cost, margins compressed 15%');
      } else {
        consequences.immediate.push('Insufficient cash for air freight');
      }
      break;
      
    case 'reduce_exposure':
      newState.demand *= 0.85;
      newState.reputation -= 0.15;
      newState.risk_level -= 0.12;
      
      consequences.immediate.push('Reduced market exposure and commitments');
      consequences.secondary.push('Lower risk profile achieved');
      consequences.tradeoffs.push('Market share and reputation damaged');
      break;
  }
  
  // Apply hidden variable effects
  if (hiddenVars.market_confidence < 0.4) {
    newState.reputation *= 0.95;
  }
  
  if (hiddenVars.political_pressure > 0.7) {
    newState.cash -= 5000000;
  }
  
  return { newState, consequences, hiddenVars };
}

// ==========================================
// SIMULATION EVALUATOR
// ==========================================

function evaluateSimulation(session) {
  const history = session.history;
  const finalState = session.current_state;
  const initialState = session.initial_state;
  
  // Calculate final score
  const survivalScore = finalState.cash > 0 ? 100 : 0;
  const reputationScore = finalState.reputation * 100;
  const riskScore = (1 - finalState.risk_level) * 100;
  const efficiencyScore = (finalState.inventory / initialState.inventory) * 100;
  
  const finalScore = (
    survivalScore * 0.4 +
    reputationScore * 0.25 +
    riskScore * 0.20 +
    efficiencyScore * 0.15
  );
  
  // Decision analysis
  const decisionAnalysis = history.map((turn, idx) => {
    let evaluation = 'Adequate';
    let reason = '';
    
    if (turn.decision.action === 'do_nothing' && turn.state.risk_level > 0.6) {
      evaluation = 'Poor';
      reason = 'Inaction under high risk conditions';
    } else if (turn.decision.action === 'diversify_suppliers' && turn.state.risk_level > 0.5) {
      evaluation = 'Good';
      reason = 'Proactive risk management';
    } else if (turn.decision.action === 'emergency_airlift' && turn.state.cash < 100000000) {
      evaluation = 'Poor';
      reason = 'Excessive spending with low cash reserves';
    }
    
    return {
      turn: idx + 1,
      decision: turn.decision.action,
      evaluation,
      reason,
      state_snapshot: {
        cash: turn.state.cash,
        risk: turn.state.risk_level
      }
    };
  });
  
  // Bias detection
  const biases = [];
  const doNothingCount = history.filter(h => h.decision.action === 'do_nothing').length;
  const emergencyCount = history.filter(h => h.decision.action === 'emergency_airlift').length;
  
  if (doNothingCount >= 3) {
    biases.push({
      bias: 'Loss Aversion',
      description: 'Consistently delayed action to avoid short-term costs, increasing long-term risk'
    });
  }
  
  if (emergencyCount >= 2) {
    biases.push({
      bias: 'Recency Bias',
      description: 'Over-reacted to immediate crises without strategic planning'
    });
  }
  
  // Optimal strategy
  const optimal = generateOptimalStrategy(session);
  
  // Counterfactual
  const counterfactual = {
    user_outcome: finalScore,
    optimal_outcome: optimal.score,
    gap: optimal.score - finalScore
  };
  
  return {
    final_score: Math.round(finalScore),
    survival_probability: finalState.cash > 0 ? 1.0 : 0.0,
    performance_tier: finalScore >= 75 ? 'Optimal' : finalScore >= 50 ? 'Adequate' : 'Suboptimal',
    decision_analysis: decisionAnalysis,
    bias_analysis: biases,
    optimal_strategy: optimal.decisions,
    counterfactual,
    lessons: generateLessons(decisionAnalysis, biases)
  };
}

function generateOptimalStrategy(session) {
  // Simple heuristic for optimal play
  const optimalDecisions = [];
  let score = 85; // Base optimal score
  
  session.history.forEach((turn, idx) => {
    const state = turn.state;
    let optimal = 'diversify_suppliers';
    
    if (state.risk_level > 0.7) {
      optimal = 'reduce_exposure';
    } else if (state.inventory < 50000) {
      optimal = 'increase_inventory';
    } else if (state.supplier_diversification < 0.6) {
      optimal = 'diversify_suppliers';
    }
    
    optimalDecisions.push({
      turn: idx + 1,
      action: optimal,
      rationale: `At risk level ${state.risk_level}, this action balances exposure and growth`
    });
  });
  
  return { decisions: optimalDecisions, score };
}

function generateLessons(analysis, biases) {
  const lessons = [];
  
  const poorDecisions = analysis.filter(d => d.evaluation === 'Poor').length;
  if (poorDecisions >= 2) {
    lessons.push('You consistently delayed action under uncertainty, prioritizing short-term efficiency over resilience');
  }
  
  if (biases.some(b => b.bias === 'Loss Aversion')) {
    lessons.push('Loss aversion led you to avoid necessary investments, increasing cascading failure risk');
  }
  
  lessons.push('Optimal strategy required earlier diversification despite margin impact');
  lessons.push('Risk management in complex systems demands proactive, not reactive, decision-making');
  
  return lessons;
}

// ==========================================
// API ENDPOINTS
// ==========================================

app.post('/api/start', (req, res) => {
  const { userId } = req.body;
  
  const scenario = generateScenario();
  const sessionId = uuidv4();
  
  sessions.set(sessionId, {
    id: sessionId,
    userId: userId || 'anonymous',
    scenario,
    initial_state: { ...scenario.initial_state },
    current_state: { ...scenario.initial_state },
    hidden_variables: { ...scenario.hidden_variables },
    history: [],
    active_events: [],
    created_at: new Date()
  });
  
  res.json({
    sessionId,
    scenario: {
      title: scenario.narrative.title,
      description: scenario.narrative.description,
      context: scenario.narrative.context,
      state: scenario.initial_state
    },
    available_actions: [
      { id: 'diversify_suppliers', label: 'Diversify Suppliers', cost: '$45M' },
      { id: 'increase_inventory', label: 'Increase Inventory Buffer', cost: '$35M' },
      { id: 'negotiate_contracts', label: 'Renegotiate Contracts', cost: '$15M' },
      { id: 'emergency_airlift', label: 'Emergency Air Freight', cost: '$60M' },
      { id: 'reduce_exposure', label: 'Reduce Market Exposure', cost: 'Reputation' },
      { id: 'do_nothing', label: 'Maintain Current Operations', cost: 'None' }
    ]
  });
});

app.post('/api/turn', (req, res) => {
  const { sessionId, decision } = req.body;
  
  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  // Process decision
  const result = processDecision(
    session.current_state,
    decision,
    session.hidden_variables
  );
  
  // Inject random event
  const event = injectEvent(result.newState, session.scenario.turn);
  if (event) {
    const eventImpact = event.impact(result.newState);
    Object.assign(result.newState, eventImpact);
    session.active_events.push({
      turn: session.scenario.turn + 1,
      event: event.name,
      description: eventImpact.description
    });
  }
  
  // Update session
  session.history.push({
    turn: session.scenario.turn,
    state: { ...session.current_state },
    decision,
    consequences: result.consequences,
    event: event ? event.name : null
  });
  
  session.current_state = result.newState;
  session.hidden_variables = result.hiddenVars;
  session.scenario.turn++;
  
  // Check end conditions
  const isComplete = 
    session.scenario.turn >= session.scenario.max_turns ||
    session.current_state.cash <= 0 ||
    session.current_state.reputation <= 0.2;
  
  res.json({
    turn: session.scenario.turn,
    state: session.current_state,
    consequences: result.consequences,
    event: event ? { name: event.name, description: event.impact(result.newState).description } : null,
    isComplete,
    available_actions: [
      { id: 'diversify_suppliers', label: 'Diversify Suppliers', cost: '$45M' },
      { id: 'increase_inventory', label: 'Increase Inventory Buffer', cost: '$35M' },
      { id: 'negotiate_contracts', label: 'Renegotiate Contracts', cost: '$15M' },
      { id: 'emergency_airlift', label: 'Emergency Air Freight', cost: '$60M' },
      { id: 'reduce_exposure', label: 'Reduce Market Exposure', cost: 'Reputation' },
      { id: 'do_nothing', label: 'Maintain Current Operations', cost: 'None' }
    ]
  });
});

app.post('/api/end', (req, res) => {
  const { sessionId } = req.body;
  
  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const feedback = evaluateSimulation(session);
  
  res.json({
    feedback,
    final_state: session.current_state,
    history: session.history,
    events: session.active_events
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', sessions: sessions.size });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Crisis Simulation Engine running on port ${PORT}`);
});