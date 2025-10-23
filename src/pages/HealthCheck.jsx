import { useState, useEffect } from 'react';
import { healthCheck } from '../services/api'; 

function HealthCheckPage() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthCheck();
      setHealthStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-check">
      {/* <h1> jsme nechali v App.jsx jako hlavní nadpis */}
      <h2>Backend Health Check</h2>

      {loading && <p>Connecting to backend...</p>}

      {error && (
        <div className="error">
          <p>❌ Backend not available</p>
          <p>{error}</p>
        </div>
      )}

      {healthStatus && (
        <div className="success">
          <p>✅ Backend is running!</p>
          <pre>{JSON.stringify(healthStatus, null, 2)}</pre>
        </div>
      )}

      <button onClick={checkHealth} disabled={loading}>
        {loading ? 'Checking...' : 'Check Again'}
      </button>
    </div>
  );
}

export default HealthCheckPage;