import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ text: input }),
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch (e) {
      console.error("Error:", e);
      setError(`Network error: ${e.message}`);
    }

    setLoading(false);
  };

  const parseResult = (resultText) => {
    if (!resultText) return null;

    const lines = resultText.split('\n');
    const parsed = { flags: '', explanation: '', confidence: '' };

    lines.forEach(line => {
      if (line.startsWith('Flags:')) {
        parsed.flags = line.replace('Flags:', '').trim();
      } else if (line.startsWith('Explanation:')) {
        parsed.explanation = line.replace('Explanation:', '').trim();
      } else if (line.startsWith('Confidence:')) {
        parsed.confidence = line.replace('Confidence:', '').trim();
      }
    });

    return parsed;
  };

  const getConfidenceColor = (confidence) => {
    const conf = confidence.toLowerCase();
    if (conf.includes('high')) return '#e74c3c';
    if (conf.includes('medium')) return '#f39c12';
    return '#27ae60';
  };

  const parsedResult = parseResult(result);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Floating particles background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <div style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '10px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🔍 TruthLens
          </div>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            AI-powered misinformation detection and bias analysis
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          marginBottom: '30px'
        }}>
          <div style={{
            position: 'relative',
            marginBottom: '30px'
          }}>
            <textarea
              rows={6}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="📰 Paste any news headline, social media post, or article excerpt here..."
              style={{
                width: '100%',
                fontSize: '16px',
                padding: '20px',
                borderRadius: '16px',
                border: '2px solid #e1e8ed',
                background: '#fafbfc',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: input ? '0 8px 25px rgba(102, 126, 234, 0.15)' : '0 4px 15px rgba(0, 0, 0, 0.05)'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = '#ffffff';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e1e8ed';
                e.target.style.background = '#fafbfc';
              }}
              disabled={loading}
            />

            {input && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                color: '#667eea',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {input.length} characters
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              style={{
                padding: '16px 40px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '50px',
                background: loading || !input.trim()
                  ? 'linear-gradient(45deg, #bdc3c7, #95a5a6)'
                  : 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading || !input.trim()
                  ? 'none'
                  : '0 8px 25px rgba(102, 126, 234, 0.3)',
                transform: loading ? 'scale(0.98)' : 'scale(1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                if (!loading && input.trim()) {
                  e.target.style.transform = 'scale(1.05) translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={e => {
                if (!loading && input.trim()) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Analyzing...
                </span>
              ) : '🚀 Analyze Content'}
            </button>
          </div>
        </div>

        {/* Results */}
        {(error || result) && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'slideUp 0.5s ease-out'
          }}>
            {error && (
              <div style={{
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                color: 'white',
                padding: '20px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                fontSize: '16px',
                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
              }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Analysis Failed</div>
                  <div style={{ opacity: 0.9 }}>{error}</div>
                </div>
              </div>
            )}

            {parsedResult && (
              <div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#2c3e50',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  📊 Analysis Results
                </div>

                {/* Confidence Badge */}
                {parsedResult.confidence && (
                  <div style={{
                    display: 'inline-block',
                    background: getConfidenceColor(parsedResult.confidence),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '20px',
                    boxShadow: `0 4px 15px ${getConfidenceColor(parsedResult.confidence)}33`
                  }}>
                    Confidence: {parsedResult.confidence}
                  </div>
                )}

                {/* Flags */}
                {parsedResult.flags && (
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                      color: '#e74c3c',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🚩 Detected Issues
                    </h3>
                    <div style={{
                      background: 'linear-gradient(45deg, #ffebee, #fce4ec)',
                      padding: '15px',
                      borderRadius: '12px',
                      border: '1px solid #f8bbd9',
                      fontSize: '15px',
                      color: '#c62828'
                    }}>
                      {parsedResult.flags}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {parsedResult.explanation && (
                  <div>
                    <h3 style={{
                      color: '#3498db',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      💡 Detailed Analysis
                    </h3>
                    <div style={{
                      background: 'linear-gradient(45deg, #e3f2fd, #e1f5fe)',
                      padding: '15px',
                      borderRadius: '12px',
                      border: '1px solid #b3e5fc',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#1565c0'
                    }}>
                      {parsedResult.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px'
        }}>
          <p>Powered by AI • Always verify important information from multiple sources</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}

export default App;