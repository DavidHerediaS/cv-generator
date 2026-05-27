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
    plantilla: 'modern',
    foto_base64: null,
    proyectos: [],
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
        nombre: cv.nombre || '',
        apellidos: cv.apellidos || '',
        email: cv.email || '',
        telefono: cv.telefono || '',
        ciudad: cv.ciudad || '',
        linkedin: cv.linkedin || '',
        github: cv.github || '',
        web: cv.web || '',
        foto_url: cv.foto_url || '',
        titulo_profesional: cv.titulo_profesional || '',
        resumen: cv.resumen || '',
        plantilla: cv.plantilla || 'modern',
        foto_base64: null,
        proyectos: (cv.proyectos || []).map(p => ({
          nombre: p.nombre || '',
          descripcion: p.descripcion || '',
          tecnologias: p.tecnologias || '',
          url: p.url || ''
        })),
        experiencias: (cv.experiencias || []).map(e => ({
          empresa: e.empresa || '',
          cargo: e.cargo || '',
          fecha_inicio: e.fecha_inicio || '',
          fecha_fin: e.fecha_fin || '',
          descripcion: e.descripcion || ''
        })),
        educaciones: (cv.educaciones || []).map(e => ({
          institucion: e.institucion || '',
          titulo: e.titulo || '',
          fecha_inicio: e.fecha_inicio || '',
          fecha_fin: e.fecha_fin || '',
          descripcion: e.descripcion || ''
        })),
        habilidades: (cv.habilidades || []).map(h => ({ nombre: h.nombre || '' })),
        idiomas: (cv.idiomas || []).map(i => ({ idioma: i.idioma || '', nivel: i.nivel || '' }))
      })
    } catch (err) {
      setError('Error al cargar el CV')
    }
  }

  const handleField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no puede superar 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      setFormData(prev => ({ ...prev, foto_base64: base64 }))
    }
    reader.readAsDataURL(file)
  }

  // --- PROYECTOS ---
  const addProyecto = () => {
    setFormData(prev => ({
      ...prev,
      proyectos: [...prev.proyectos, { nombre: '', descripcion: '', tecnologias: '', url: '' }]
    }))
  }

  const updateProyecto = (index, field, value) => {
    const updated = [...formData.proyectos]
    updated[index][field] = value
    setFormData(prev => ({ ...prev, proyectos: updated }))
  }

  const removeProyecto = (index) => {
    setFormData(prev => ({
      ...prev,
      proyectos: prev.proyectos.filter((_, i) => i !== index)
    }))
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

    const cleanFecha = (val) => (!val || val === '') ? null : val

    const cleanExperiencia = (exp) => ({
      empresa: exp.empresa,
      cargo: exp.cargo,
      fecha_inicio: exp.fecha_inicio,
      fecha_fin: cleanFecha(exp.fecha_fin),
      descripcion: exp.descripcion || null
    })

    const cleanEducacion = (edu) => ({
      institucion: edu.institucion,
      titulo: edu.titulo,
      fecha_inicio: edu.fecha_inicio,
      fecha_fin: cleanFecha(edu.fecha_fin),
      descripcion: edu.descripcion || null
    })

    const cleanProyecto = (p) => ({
      nombre: p.nombre || null,
      descripcion: p.descripcion || null,
      tecnologias: p.tecnologias || null,
      url: p.url || null
    })

    const payload = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      email: formData.email,
      telefono: formData.telefono,
      ciudad: formData.ciudad,
      linkedin: formData.linkedin || null,
      github: formData.github || null,
      web: formData.web || null,
      foto_url: formData.foto_url || null,
      foto_base64: formData.foto_base64 || null,
      titulo_profesional: formData.titulo_profesional || null,
      resumen: formData.resumen || null,
      plantilla: formData.plantilla || 'modern',
      proyectos: formData.proyectos
        .filter(p => p.nombre || p.descripcion || p.url)
        .map(cleanProyecto),
      experiencias: formData.experiencias
        .filter(e => e.empresa && e.cargo && e.fecha_inicio)
        .map(cleanExperiencia),
      educaciones: formData.educaciones
        .filter(e => e.institucion && e.titulo && e.fecha_inicio)
        .map(cleanEducacion),
      habilidades: formData.habilidades
        .filter(h => h.nombre)
        .map(h => ({ nombre: h.nombre })),
      idiomas: formData.idiomas
        .filter(i => i.idioma && i.nivel)
        .map(i => ({ idioma: i.idioma, nivel: i.nivel }))
    }

    try {
      if (isEditing) {
        await updateCV(id, payload)
      } else {
        await createCV(payload)
      }
      navigate('/dashboard')
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        setError('Error de validación: ' + detail.map(d => d.msg).join(', '))
      } else if (typeof detail === 'string') {
        setError(detail)
      } else {
        setError('Error al guardar el CV')
      }
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

          {/* PLANTILLA E IMAGEN */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Estilo del currículum</h3>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <label style={styles.label}>Selecciona el estilo</label>
                <div style={styles.plantillasGrid}>
                  {[
                    { id: 'modern', nombre: 'Moderno', desc: 'Cabecera azul, diseño actual' },
                    { id: 'classic', nombre: 'Clásico', desc: 'Tipografía serif, estilo formal' },
                    { id: 'minimal', nombre: 'Minimalista', desc: 'Dos columnas, espacios blancos' }
                  ].map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleField('plantilla', p.id)}
                      style={{
                        ...styles.plantillaCard,
                        ...(formData.plantilla === p.id ? styles.plantillaCardActiva : {})
                      }}
                    >
                      <div style={styles.plantillaNombre}>{p.nombre}</div>
                      <div style={styles.plantillaDesc}>{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Foto de perfil (opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  style={styles.inputFile}
                />
                {formData.foto_base64 && (
                  <div style={styles.fotoPreview}>
                    <img
                      src={`data:image/jpeg;base64,${formData.foto_base64}`}
                      alt="Preview"
                      style={styles.fotoPreviewImg}
                    />
                    <button
                      type="button"
                      style={styles.buttonRemove}
                      onClick={() => handleField('foto_base64', null)}
                    >
                      Quitar foto
                    </button>
                  </div>
                )}
                <p style={styles.inputHint}>JPG o PNG, máximo 2MB</p>
              </div>
            </div>
          </div>

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

          {/* PROYECTOS */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Proyectos destacados</h3>
              <button type="button" style={styles.buttonAdd} onClick={addProyecto}>
                + Añadir
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', marginTop: '-8px' }}>
              Opcional — proyectos personales, académicos o profesionales que quieras destacar
            </p>
            {formData.proyectos.map((proyecto, i) => (
              <div key={i} style={styles.itemCard}>
                <div style={styles.itemCardHeader}>
                  <span style={styles.itemCardTitle}>Proyecto {i + 1}</span>
                  <button type="button" style={styles.buttonRemove}
                    onClick={() => removeProyecto(i)}>✕</button>
                </div>
                <div style={styles.grid2}>
                  <div style={styles.field}>
                    <label style={styles.label}>Nombre del proyecto</label>
                    <input style={styles.input} value={proyecto.nombre}
                      onChange={e => updateProyecto(i, 'nombre', e.target.value)}
                      placeholder="Ej: CV Generator" />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>URL (opcional)</label>
                    <input style={styles.input} value={proyecto.url}
                      onChange={e => updateProyecto(i, 'url', e.target.value)}
                      placeholder="https://github.com/..." />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Tecnologías (separadas por comas)</label>
                    <input style={styles.input} value={proyecto.tecnologias}
                      onChange={e => updateProyecto(i, 'tecnologias', e.target.value)}
                      placeholder="Ej: Python, FastAPI, React" />
                  </div>
                  <div style={{ ...styles.field, gridColumn: 'span 2' }}>
                    <label style={styles.label}>Descripción (opcional)</label>
                    <textarea style={styles.textarea} value={proyecto.descripcion}
                      onChange={e => updateProyecto(i, 'descripcion', e.target.value)}
                      placeholder="Breve descripción del proyecto..."
                      rows={3} />
                  </div>
                </div>
              </div>
            ))}
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
  },
  plantillasGrid: {
    display: 'flex',
    gap: '10px',
    marginTop: '6px'
  },
  plantillaCard: {
    flex: 1,
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    textAlign: 'center'
  },
  plantillaCardActiva: {
    border: '2px solid #2563eb',
    background: '#eff6ff'
  },
  plantillaNombre: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: '4px'
  },
  plantillaDesc: {
    fontSize: '11px',
    color: '#64748b'
  },
  inputFile: {
    padding: '8px 0',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%'
  },
  fotoPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px'
  },
  fotoPreviewImg: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '2px solid #e2e8f0'
  },
  inputHint: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px'
  }
}

export default CVForm