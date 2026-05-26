import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCVs, deleteCV, downloadPDF, logout } from '../services/api'

function Dashboard() {
  const navigate = useNavigate()
  const [cvs, setCvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)

  useEffect(() => {
    fetchCVs()
  }, [])

  const fetchCVs = async () => {
    try {
      const response = await getCVs()
      setCvs(response.data)
    } catch (err) {
      setError('Error al cargar los currículums')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este CV?')) return
    setDeletingId(id)
    try {
      await deleteCV(id)
      setCvs(cvs.filter(cv => cv.id !== id))
    } catch (err) {
      setError('Error al eliminar el CV')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = async (id) => {
    setDownloadingId(id)
    try {
      await downloadPDF(id)
    } catch (err) {
      setError('Error al descargar el PDF')
    } finally {
      setDownloadingId(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={styles.container}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>CV Generator</h1>
        <div style={styles.navActions}>
          <button
            style={styles.buttonPrimary}
            onClick={() => navigate('/cv/new')}
          >
            + Nuevo CV
          </button>
          <button
            style={styles.buttonLogout}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Mis currículums</h2>

        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <div style={styles.loading}>Cargando...</div>
        ) : cvs.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>Todavía no tienes ningún CV</p>
            <button
              style={styles.buttonPrimary}
              onClick={() => navigate('/cv/new')}
            >
              Crear mi primer CV
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {cvs.map(cv => (
              <div key={cv.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardName}>
                      {cv.nombre} {cv.apellidos}
                    </h3>
                    {cv.titulo_profesional && (
                      <p style={styles.cardTitulo}>{cv.titulo_profesional}</p>
                    )}
                    <p style={styles.cardCiudad}>📍 {cv.ciudad}</p>
                  </div>
                </div>

                <div style={styles.cardInfo}>
                  {cv.habilidades?.length > 0 && (
                    <div style={styles.skills}>
                      {cv.habilidades.slice(0, 4).map(skill => (
                        <span key={skill.id} style={styles.skillTag}>
                          {skill.nombre}
                        </span>
                      ))}
                      {cv.habilidades.length > 4 && (
                        <span style={styles.skillMore}>
                          +{cv.habilidades.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div style={styles.cardActions}>
                  <button
                    style={styles.buttonEdit}
                    onClick={() => navigate(`/cv/${cv.id}/edit`)}
                  >
                    Editar
                  </button>
                  <button
                    style={downloadingId === cv.id ? styles.buttonDisabled : styles.buttonDownload}
                    onClick={() => handleDownload(cv.id)}
                    disabled={downloadingId === cv.id}
                  >
                    {downloadingId === cv.id ? 'Generando...' : 'Descargar PDF'}
                  </button>
                  <button
                    style={deletingId === cv.id ? styles.buttonDisabled : styles.buttonDelete}
                    onClick={() => handleDelete(cv.id)}
                    disabled={deletingId === cv.id}
                  >
                    {deletingId === cv.id ? '...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: 'Arial, sans-serif'
  },
  navbar: {
    background: '#1e3a5f',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  navTitle: {
    color: 'white',
    fontSize: '22px',
    fontWeight: 'bold',
    margin: 0
  },
  navActions: {
    display: 'flex',
    gap: '12px'
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 20px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: '24px'
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '16px',
    padding: '48px'
  },
  empty: {
    textAlign: 'center',
    padding: '64px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  emptyText: {
    fontSize: '18px',
    color: '#64748b'
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  cardHeader: {
    marginBottom: '12px'
  },
  cardName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    margin: '0 0 4px 0'
  },
  cardTitulo: {
    fontSize: '14px',
    color: '#2563eb',
    margin: '0 0 4px 0'
  },
  cardCiudad: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0
  },
  cardInfo: {
    marginBottom: '16px'
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px'
  },
  skillTag: {
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    borderRadius: '4px',
    padding: '2px 10px',
    fontSize: '12px'
  },
  skillMore: {
    background: '#f1f5f9',
    color: '#64748b',
    borderRadius: '4px',
    padding: '2px 10px',
    fontSize: '12px'
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '16px'
  },
  buttonPrimary: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  buttonEdit: {
    background: '#f1f5f9',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  buttonDownload: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  buttonDelete: {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  buttonDisabled: {
    background: '#e2e8f0',
    color: '#94a3b8',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    cursor: 'not-allowed'
  },
  buttonLogout: {
    background: 'transparent',
    color: '#93c5fd',
    border: '1px solid #93c5fd',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer'
  }
}

export default Dashboard