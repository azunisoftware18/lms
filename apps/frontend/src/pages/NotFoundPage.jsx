import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Inject CSS animations on mount
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      
      @keyframes glitch-1 {
        0%, 100% { transform: translate(0); opacity: 0.3; }
        20% { transform: translate(-8px, 4px); opacity: 0.5; }
        40% { transform: translate(8px, -4px); opacity: 0.5; }
        60% { transform: translate(-4px, 2px); opacity: 0.4; }
        80% { transform: translate(4px, -2px); opacity: 0.4; }
      }
      
      @keyframes glitch-2 {
        0%, 100% { transform: translate(0); opacity: 0.3; }
        20% { transform: translate(8px, -4px); opacity: 0.5; }
        40% { transform: translate(-8px, 4px); opacity: 0.5; }
        60% { transform: translate(4px, -2px); opacity: 0.4; }
        80% { transform: translate(-4px, 2px); opacity: 0.4; }
      }
      
      @keyframes glitch-3 {
        0%, 100% { transform: translate(0); opacity: 0.3; }
        20% { transform: translate(-4px, -4px); opacity: 0.5; }
        40% { transform: translate(4px, 4px); opacity: 0.5; }
        60% { transform: translate(-2px, -2px); opacity: 0.4; }
        80% { transform: translate(2px, 2px); opacity: 0.4; }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .not-found-blob {
        animation: blob 7s infinite;
      }
      
      .not-found-glitch-1 {
        animation: glitch-1 3s infinite;
      }
      
      .not-found-glitch-2 {
        animation: glitch-2 3s infinite;
      }
      
      .not-found-glitch-3 {
        animation: glitch-3 3s infinite;
      }
      
      .not-found-delay-2 {
        animation-delay: 2s;
      }
      
      .not-found-delay-4 {
        animation-delay: 4s;
      }
      
      .not-found-delay-6 {
        animation-delay: 6s;
      }
      
      .not-found-pulse {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerStyle = {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #1a0f1a 100%)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };

  const blobStyle = {
    position: 'absolute',
    borderRadius: '50%',
    mixBlendMode: 'multiply',
    filter: 'blur(40px)',
    opacity: 0.2,
  };

  const glowStyle = {
    position: 'absolute',
    width: '384px',
    height: '384px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(217, 70, 239, 0.2) 0%, rgba(147, 51, 234, 0.15) 50%, transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    transition: 'all 300ms ease-out',
  };

  const contentBoxStyle = {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '80rem',
    margin: '0 auto',
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
  };

  const titleStyle = {
    fontSize: 'clamp(3rem, 15vw, 12rem)',
    fontWeight: '900',
    lineHeight: '1',
    margin: '0 0 2rem 0',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 50%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const sectionStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
    alignItems: 'start',
  };

  const codeBoxStyle = {
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderRadius: '1rem',
    padding: '1.5rem',
    transition: 'border-color 200ms ease',
    cursor: 'default',
  };

  const codeBoxHoverStyle = {
    borderColor: 'rgba(6, 182, 212, 0.4)',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    color: '#06b6d4',
    fontFamily: 'monospace',
  };

  const dotStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#06b6d4',
    animation: 'pulse 2s infinite',
  };

  const preStyle = {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    color: '#a5f3fc',
    margin: 0,
    overflow: 'auto',
    maxHeight: '200px',
  };

  const centerBoxStyle = {
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: 'clamp(1.875rem, 5vw, 2.25rem)',
    fontWeight: 'bold',
    marginBottom: '1rem',
  };

  const descriptionStyle = {
    color: '#9ca3af',
    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
    maxWidth: '28rem',
    margin: '0 auto',
    lineHeight: '1.6',
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    maxWidth: '32rem',
    margin: '0 auto 3rem',
  };

  const statItemStyle = {
    textAlign: 'center',
    position: 'relative',
  };

  const statValueStyle = {
    fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
    fontWeight: '900',
    background: 'linear-gradient(180deg, #06b6d4 0%, #0891b2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const statLabelStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.5rem',
    fontWeight: '500',
  };

  const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const primaryButtonStyle = {
    position: 'relative',
    paddingX: '2rem',
    paddingY: '1rem',
    borderRadius: '1rem',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '280px',
    border: 'none',
    background: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 50%, #a855f7 100%)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 200ms ease',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const buttonHoverStyle = {
    transform: 'scale(1.05)',
  };

  const secondaryButtonStyle = {
    position: 'relative',
    paddingX: '2rem',
    paddingY: '1rem',
    borderRadius: '1rem',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '280px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.5) 0%, rgba(31, 41, 55, 0.5) 100%)',
    color: '#d1d5db',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const secondaryButtonHoverStyle = {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    color: 'white',
  };

  const terminalStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    padding: '0.5rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: '#9ca3af',
    marginTop: '2rem',
  };

  const greenDotStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: '#4ade80',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  };

  return (
    <div style={containerStyle}>
      {/* Animated Background Blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          className="not-found-blob"
          style={{
            ...blobStyle,
            width: '320px',
            height: '320px',
            top: '-160px',
            left: '-160px',
            backgroundColor: '#ec4899',
          }}
        />
        <div
          className="not-found-blob not-found-delay-2"
          style={{
            ...blobStyle,
            width: '320px',
            height: '320px',
            top: '-160px',
            right: '-160px',
            backgroundColor: '#06b6d4',
          }}
        />
        <div
          className="not-found-blob not-found-delay-4"
          style={{
            ...blobStyle,
            width: '320px',
            height: '320px',
            bottom: '160px',
            left: '80px',
            backgroundColor: '#a855f7',
          }}
        />
        <div
          className="not-found-blob not-found-delay-6"
          style={{
            ...blobStyle,
            width: '320px',
            height: '320px',
            bottom: '80px',
            right: '80px',
            backgroundColor: '#ec4899',
          }}
        />
      </div>

      {/* Mouse Glow Effect */}
      <div
        style={{
          ...glowStyle,
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
        }}
      />

      {/* Main Content */}
      <div style={contentBoxStyle}>
        {/* 404 Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={titleStyle}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              className="not-found-glitch-1"
              style={{
                position: 'absolute',
                inset: 0,
                color: 'rgba(6, 182, 212, 0.3)',
              }}
            >
              404
            </span>
            <span
              className="not-found-glitch-2"
              style={{
                position: 'absolute',
                inset: 0,
                color: 'rgba(236, 72, 153, 0.3)',
              }}
            >
              404
            </span>
            <span
              className="not-found-glitch-3"
              style={{
                position: 'absolute',
                inset: 0,
                color: 'rgba(168, 85, 247, 0.3)',
              }}
            >
              404
            </span>
            <span style={{ position: 'relative' }}>404</span>
          </span>
        </motion.h1>

        {/* Three Column Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={sectionStyle}
        >
          {/* Left Box - Error Code */}
          <div style={codeBoxStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, codeBoxHoverStyle)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: 'rgba(6, 182, 212, 0.2)' })}>
            <div style={labelStyle}>
              <div style={dotStyle} className="not-found-pulse" />
              error.xml
            </div>
            <pre style={preStyle}>
{`<error code="404">
    <message>
      Page not found
    </message>
</error>`}
            </pre>
          </div>

          {/* Center Box - Title and Description */}
          <div style={centerBoxStyle}>
            <h2 style={{ ...headingStyle, background: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Lost in the<br />Digital Void
            </h2>
            <p style={descriptionStyle}>
              The cosmic path you were searching for has collapsed into a black hole. Let's navigate you back to safer dimensions.
            </p>
          </div>

          {/* Right Box - Console Log */}
          <div style={{ ...codeBoxStyle, borderColor: 'rgba(236, 72, 153, 0.2)' }} onMouseEnter={(e) => Object.assign(e.currentTarget.style, { borderColor: 'rgba(236, 72, 153, 0.4)' })} onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: 'rgba(236, 72, 153, 0.2)' })}>
            <div style={{ ...labelStyle, color: '#ec4899' }}>
              <div style={{ ...dotStyle, backgroundColor: '#ec4899' }} className="not-found-pulse" />
              script.js
            </div>
            <pre style={{ ...preStyle, color: '#f472b6' }}>
{`console.log("404");
// Location unknown
throw new Error(
  "Page missing"
);`}
            </pre>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={statsStyle}
        >
          <div style={statItemStyle}>
            <div style={statValueStyle}>404</div>
            <div style={statLabelStyle}>Error Code</div>
          </div>
          <div style={statItemStyle}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
                fontWeight: '900',
                background: 'linear-gradient(180deg, #ec4899 0%, #db2777 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ∞
            </motion.div>
            <div style={statLabelStyle}>Light Years</div>
          </div>
          <div style={statItemStyle}>
            <div style={{ ...statValueStyle, background: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)' }}>0x1F4</div>
            <div style={statLabelStyle}>Hex Code</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={buttonsContainerStyle}
        >
          <Link
            to="/"
            style={primaryButtonStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'scale(1)' })}
          >
            Return Home
            <span>→</span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            style={secondaryButtonStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, secondaryButtonHoverStyle)}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(55, 65, 81, 0.5)',
                color: '#d1d5db',
              });
            }}
          >
            <span>←</span>
            Go Back
          </button>
        </motion.div>

        {/* Terminal Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <div style={terminalStyle}>
            <div style={greenDotStyle} />
            <span style={{ color: '#06b6d4' }}>user@void</span>
            <span>:</span>
            <span style={{ color: '#ec4899' }}>~</span>
            <span style={{ color: '#a0aec0' }}>$</span>
            <span style={{ color: '#a855f7' }}>find /home --lost</span>
            <span className="not-found-pulse" style={{ marginLeft: '0.25rem' }}>_</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;