import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createCV, getCV, updateCV } from '../services/api'

function CVForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    ciudad: '',
    linkedin: '',
    github: '',
    web: '',
    foto_url: '',
    titulo_profesional: '',
    resumen: '',
    experiencias: [],
    educaciones: [],
    habilidades: [],
    idiomas: []
  })

  useEffect(() => {
    if (isEditing) {
      fetchCV()
    }
  }, [id])

  const fetchCV = async () => {
    try {
      const response = await getCV(id)
      const cv = response.data
      setFormData({
        ...cv,
        linkedin: cv.linkedin || '',
        github: cv.github || '',
        web: cv.web || '',
        foto_url: cv.foto_url || '',
        titulo_profesional: cv.titulo_profesional || '',
        resumen: cv.resumen || '',
      })
    } catch (err) {
        const detail = err.response?.data?.detail
        setError(typeof detail === 'string' ? detail : 'Error al guardar el CV. Revisa los campos obligatorios.')
    }
  }

  const handleField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // --- EXPERIENCIAS ---
  const addExperiencia = () => {
    setFormData(prev => ({
      ...prev,
      experiencias: [...prev.experiencias, {
        empresa: '', cargo: '', fecha_inicio: '', fecha_fin: '', descripcion: ''
      }]
    }))
  }

  const updateExperiencia = (index, field, value) => {
    const updated = [...formData.experiencias]
    updated[index][field] = value
    setFormData(prev => ({ ...prev, experiencias: updated }))
  }

  const removeExperiencia = (index) => {
    setFormData(prev => ({
      ...prev,
      experiencias: prev.experiencias.filter((_, i) => i !== index)
    }))
  }

  // --- EDUCACIONES ---
  const addEducacion = () => {
    setFormData(prev => ({
      ...prev,
      educaciones: [...prev.educaciones, {
        institucion: '', titulo: '', fecha_inicio: '', fecha_fin: '', descripcion: ''
      }]
    }))
  }

  const updateEducacion = (index, field, value) => {
    const updated = [...formData.educaciones]
    updated[index][field] = value
    setFormData(prev => ({ ...prev, educaciones: updated }))
  }

  const removeEducacion = (index) => {
    setFormData(prev => ({
      ...prev,
      educaciones: prev.educaciones.filter((_, i) => i !== index)
    }))
  }

  // --- HABILIDADES ---
  const addHabilidad = () => {
    setFormData(prev => ({
      ...prev,
      habilidades: [...prev.habilidades, { nombre: '' }]
    }))
  }

  const updateHabilidad = (index, value) => {
    const updated = [...formData.habilidades]
    updated[index].nombre = value
    setFormData(prev => ({ ...prev, habilidades: updated }))
  }

  const removeHabilidad = (index) => {
    setFormData(prev => ({
      ...prev,
      habilidades: prev.habilidades.filter((_, i) => i !== index)
    }))
  }

  // --- IDIOMAS ---
  const addIdioma = () => {
    setFormData(prev => ({
      ...prev,
      idiomas: [...prev.idiomas, { idioma: '', nivel: '' }]
    }))
  }

  const updateIdioma = (index, field, value) => {
    const updated = [...formData.idiomas]
    updated[index][field] = value
    setFormData(prev => ({ ...prev, idiomas: updated }))
  }

  const removeIdioma = (index) => {
    setFormData(prev => ({
      ...prev,
      idiomas: prev.idiomas.filter((_, i) => i !== index)
    }))
  }

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const cleanFecha = (val) => val === '' ? null : val

    const payload = {
    ...formData,
    linkedin: formData.linkedin || null,
    github: formData.github || null,
    web: formData.web || null,
    foto_url: formData.foto_url || null,
    titulo_profesional: formData.titulo_profesional || null,
    resumen: formData.resumen || null,
    experiencias: formData.experiencias
        .filter(e => e.empresa && e.cargo && e.fecha_inicio)
        .map(e => ({ ...e, fecha_fin: cleanFecha(e.fecha_fin), descripcion: e.descripcion || null })),
    educaciones: formData.educaciones
        .filter(e => e.institucion && e.titulo && e.fecha_inicio)
        .map(e => ({ ...e, fecha_fin: cleanFecha(e.fecha_fin), descripcion: e.descripcion || null })),
    habilidades: formData.habilidades.filter(h => h.nombre),
    idiomas: formData.idiomas.filter(i => i.idioma && i.nivel)
    }

    try {
      if (isEditing) {
        await updateCV(id, payload)
      } else {
        await createCV(payload)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar el CV')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>CV Generator</h1>
        <button style={styles.buttonBack} onClick={() => navigate('/dashboard')}>
          ← Volver
        </button>
      </div>

      <div style={styles.content}>
        <h2 style={styles.pageTitle}>
          {isEditing ? 'Editar CV' : 'Crear nuevo CV'}
        </h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* DATOS PERSONALES */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Datos personales</h3>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <label style={styles.label}>Nombre *</label>
                <input style={styles.input} value={formData.nombre}
                  onChange={e => handleField('nombre', e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Apellidos *</label>
                <input style={styles.input} value={formData.apellidos}
                  onChange={e => handleField('apellidos', e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email *</label>
                <input style={styles.input} type="email" value={formData.email}
                  onChange={e => handleField('email', e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Teléfono *</label>
                <input style={styles.input} value={formData.telefono}
                  onChange={e => handleField('telefono', e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Ciudad *</label>
                <input style={styles.input} value={formData.ciudad}
                  onChange={e => handleField('ciudad', e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>URL Foto (opcional)</label>
                <input style={styles.input} value={formData.foto_url}
                  onChange={e => handleField('foto_url', e.target.value)}
                  placeholder="https://..." />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>LinkedIn (opcional)</label>
                <input style={styles.input} value={formData.linkedin}
                  onChange={e => handleField('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..." />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>GitHub (opcional)</label>
                <input style={styles.input} value={formData.github}
                  onChange={e => handleField('github', e.target.value)}
                  placeholder="https://github.com/..." />
              </div>
              <div style={{ ...styles.field, gridColumn: 'span 2' }}>
                <label style={styles.label}>Web personal (opcional)</label>
                <input style={styles.input} value={formData.web}
                  onChange={e => handleField('web', e.target.value)}
                  placeholder="https://..." />
              </div>
            </div>
          </div>

          {/* PERFIL PROFESIONAL */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Perfil profesional</h3>
            <div style={styles.field}>
              <label style={styles.label}>Título profesional (opcional)</label>
              <input style={styles.input} value={formData.titulo_profesional}
                onChange={e => handleField('titulo_profesional', e.target.value)}
                placeholder="Ej: Desarrollador Full Stack" />
            </div>
            <div style={{ ...styles.field, marginTop: '16px' }}>
              <label style={styles.label}>Resumen (opcional)</label>
              <textarea style={styles.textarea} value={formData.resumen}
                onChange={e => handleField('resumen', e.target.value)}
                placeholder="Breve descripción profesional..."
                rows={4} />
            </div>
          </div>

          {/* EXPERIENCIA */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Experiencia profesional</h3>
              <button type="button" style={styles.buttonAdd} onClick={addExperiencia}>
                + Añadir
              </button>
            </div>
            {formData.experiencias.map((exp, i) => (
              <div key={i} style={styles.itemCard}>
                <div style={styles.itemCardHeader}>
                  <span style={styles.itemCardTitle}>Experiencia {i + 1}</span>
                  <button type="button" style={styles.buttonRemove}
                    onClick={() => removeExperiencia(i)}>✕</button>
                </div>
                <div style={styles.grid2}>
                  <div style={styles.field}>
                    <label style={styles.label}>Empresa *</label>
                    <input style={styles.input} value={exp.empresa}
                      onChange={e => updateExperiencia(i, 'empresa', e.target.value)} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Cargo *</label>
                    <input style={styles.input} value={exp.cargo}
                      onChange={e => updateExperiencia(i, 'cargo', e.target.value)} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Fecha inicio *</label>
                    <input style={styles.input} type="date" value={exp.fecha_inicio}
                      onChange={e => updateExperiencia(i, 'fecha_inicio', e.target.value)} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Fecha fin (vacío = actualidad)</label>
                    <input style={styles.input} type="date" value={exp.fecha_fin}
                      onChange={e => updateExperiencia(i, 'fecha_fin', e.target.value)} />
                  </div>
                  <div style={{ ...styles.field, gridColumn: 'span 2' }}>
                    <label style={styles.label}>Descripción (opcional)</label>
                    <textarea style={styles.textarea} value={exp.descripcion}
                      onChange={e => updateExperiencia(i, 'descripcion', e.target.value)}
                      rows={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EDUCACIÓN */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Educación</h3>
              <button type="button" style={styles.buttonAdd} onClick={addEducacion}>
                + Añadir
              </button>
            </div>
            {formData.educaciones.map((edu, i) => (
              <div key={i} style={styles.itemCard}>
                <div style={styles.itemCardHeader}>
                  <span style={styles.itemCardTitle}>Educación {i + 1}</span>
                  <button type="button" style={styles.buttonRemove}
                    onClick={() => removeEducacion(i)}>✕</button>
                </div>
                <div style={styles.grid2}>
                  <div style={styles.field}>
                    <label style={styles.label}>Institución *</label>
                    <input style={styles.input} value={edu.institucion}
                      onChange={e => updateEducacion(i, 'institucion', e.target.value)} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Título *</label>
                    <input style={styles.input} value={edu.titulo}
                      onChange={e => updateEducacion(i, 'titulo', e.target.value)} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Fecha inicio *</label>
                    <input style={styles.input} type="date" value={edu.fecha_inicio}
                      onChange={e => updateEducacion(i, 'fecha_inicio', e.target.value)} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Fecha fin (vacío = actualidad)</label>
                    <input style={styles.input} type="date" value={edu.fecha_fin}
                      onChange={e => updateEducacion(i, 'fecha_fin', e.target.value)} />
                  </div>
                  <div style={{ ...styles.field, gridColumn: 'span 2' }}>
                    <label style={styles.label}>Descripción (opcional)</label>
                    <textarea style={styles.textarea} value={edu.descripcion}
                      onChange={e => updateEducacion(i, 'descripcion', e.target.value)}
                      rows={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* HABILIDADES */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Habilidades</h3>
              <button type="button" style={styles.buttonAdd} onClick={addHabilidad}>
                + Añadir
              </button>
            </div>
            <div style={styles.tagsGrid}>
              {formData.habilidades.map((skill, i) => (
                <div key={i} style={styles.tagRow}>
                  <input style={styles.inputTag} value={skill.nombre}
                    onChange={e => updateHabilidad(i, e.target.value)}
                    placeholder="Ej: Python" />
                  <button type="button" style={styles.buttonRemove}
                    onClick={() => removeHabilidad(i)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* IDIOMAS */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Idiomas</h3>
              <button type="button" style={styles.buttonAdd} onClick={addIdioma}>
                + Añadir
              </button>
            </div>
            {formData.idiomas.map((lang, i) => (
              <div key={i} style={styles.idiomaRow}>
                <div style={styles.field}>
                  <label style={styles.label}>Idioma</label>
                  <input style={styles.input} value={lang.idioma}
                    onChange={e => updateIdioma(i, 'idioma', e.target.value)}
                    placeholder="Ej: Inglés" />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Nivel</label>
                  <select style={styles.input} value={lang.nivel}
                    onChange={e => updateIdioma(i, 'nivel', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="Nativo">Nativo</option>
                    <option value="C2">C2 — Maestría</option>
                    <option value="C1">C1 — Dominio</option>
                    <option value="B2">B2 — Avanzado</option>
                    <option value="B1">B1 — Intermedio</option>
                    <option value="A2">A2 — Básico</option>
                    <option value="A1">A1 — Iniciación</option>
                  </select>
                </div>
                <button type="button" style={{ ...styles.buttonRemove, marginTop: '22px' }}
                  onClick={() => removeIdioma(i)}>✕</button>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <div style={styles.submitRow}>
            <button type="button" style={styles.buttonCancel}
              onClick={() => navigate('/dashboard')}>
              Cancelar
            </button>
            <button type="submit"
              style={loading ? styles.buttonDisabled : styles.buttonSubmit}
              disabled={loading}>
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear CV'}
            </button>
          </div>

        </form>
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
  buttonBack: {
    background: 'transparent',
    color: '#93c5fd',
    border: '1px solid #93c5fd',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px 20px'
  },
  pageTitle: {
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
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    margin: '0 0 16px 0'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#374151'
  },
  input: {
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '100%'
  },
  textarea: {
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    resize: 'vertical',
    fontFamily: 'Arial, sans-serif'
  },
  itemCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    background: '#f8fafc'
  },
  itemCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  itemCardTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#64748b'
  },
  buttonAdd: {
    background: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  buttonRemove: {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  tagsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tagRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  inputTag: {
    padding: '8px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '140px'
  },
  idiomaRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    marginBottom: '12px'
  },
  submitRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px'
  },
  buttonCancel: {
    background: 'white',
    color: '#64748b',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '15px',
    cursor: 'pointer'
  },
  buttonSubmit: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  buttonDisabled: {
    background: '#93c5fd',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '15px',
    cursor: 'not-allowed'
  }
}

export default CVForm