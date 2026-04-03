import { useState } from "react";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [actions, setActions] = useState([]);
  const [state, setState] = useState(null);
  const [log, setLog] = useState([]);

  const startSimulation = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    const data = await res.json();

    setSessionId(data.sessionId);
    setScenario(data.scenario);
    setActions(data.available_actions);
    setState(data.scenario.state);
    setLog(["Simulation started"]);
  };

  const takeAction = async (actionId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/turn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sessionId,
        decision: { action: actionId }
      })
    });

    const data = await res.json();

    setState(data.state);
    setActions(data.available_actions);

    setLog((prev) => [
      ...prev,
      `Action: ${actionId}`,
      ...data.consequences.immediate,
      ...(data.event ? [`EVENT: ${data.event.name}`] : [])
    ]);

    if (data.isComplete) {
      const endRes = await fetch(`${process.env.REACT_APP_API_URL}/api/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sessionId })
      });

      const endData = await endRes.json();

      setLog((prev) => [
        ...prev,
        "=== SIMULATION COMPLETE ===",
        `Final Score: ${endData.feedback.final_score}`
      ]);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Crisis Simulation</h1>

      {!scenario && (
        <button onClick={startSimulation}>Start Simulation</button>
      )}

      {scenario && (
        <>
          <h2>{scenario.title}</h2>
          <p>{scenario.description}</p>
          <p><b>{scenario.context}</b></p>

          <h3>📊 Current State</h3>
          <ul>
            <li>Cash: {state.cash}</li>
            <li>Inventory: {state.inventory}</li>
            <li>Reputation: {state.reputation.toFixed(2)}</li>
            <li>Risk Level: {state.risk_level.toFixed(2)}</li>
            <li>Diversification: {state.supplier_diversification.toFixed(2)}</li>
          </ul>

          <h3>⚡ Actions</h3>
          {actions.map((a) => (
            <button
              key={a.id}
              onClick={() => takeAction(a.id)}
              style={{ margin: 5 }}
            >
              {a.label}
            </button>
          ))}

          <h3>📜 Log</h3>
          <div style={{ background: "#eee", padding: 10 }}>
            {log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;