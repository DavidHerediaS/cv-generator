import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../services/api'

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.header}>
          <h1 style={styles.title}>CV Generator</h1>
          <p style={styles.subtitle}>
            Crea tu currículum profesional en minutos y descárgalo en PDF
          </p>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📄</span>
            <span>Plantillas profesionales</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🔒</span>
            <span>Datos cifrados y seguros</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>⚡</span>
            <span>Generación instantánea en PDF</span>
          </div>
        </div>

        <div style={styles.buttons}>
          <button
            style={styles.buttonPrimary}
            onClick={() => navigate('/register')}
          >
            Crear cuenta gratis
          </button>
          <button
            style={styles.buttonSecondary}
            onClick={() => navigate(isAuthenticated() ? '/dashboard' : '/login')}
          >
            Iniciar sesión
          </button>
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    margin: '0 0 12px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
    textAlign: 'left'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '15px',
    color: '#374151',
    background: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '8px'
  },
  featureIcon: {
    fontSize: '20px'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  buttonPrimary: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  buttonSecondary: {
    background: 'white',
    color: '#2563eb',
    border: '2px solid #2563eb',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
}

export default Landing