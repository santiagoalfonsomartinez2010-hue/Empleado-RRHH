import { useRef, useState } from 'react'

/* ============================================================
   Sidebar.jsx — Columna izquierda (260px)
   Perfil editable del empleado + stats de hoy + estado del
   equipo + alertas. Mismo patrón que el empleado de atención
   al cliente: avatar con punto verde pulsante, nombre editable
   y botón "Editar perfil" que abre modo edición.
   ============================================================ */

// --- Datos constantes (demo sin backend) ---
const STATS_HOY = [
  { label: 'CVs recibidos', valor: 8, color: '#E5E7EB' },
  { label: 'Encajan', valor: 3, color: '#10B981' },
  { label: 'Entrevistas agendadas', valor: 2, color: '#6366F1' },
  { label: 'Emails de rechazo enviados', valor: 4, color: '#8A90A2' },
]

const ESTADO_EQUIPO = [
  { label: 'Trabajando', valor: 14, color: '#10B981' },
  { label: 'De vacaciones', valor: 2, color: '#3B82F6' },
  { label: 'De baja', valor: 1, color: '#EF4444' },
]

const ALERTAS = [{ label: 'Contratos vencen este mes', valor: 2, color: '#F59E0B' }]

// Devuelve las iniciales a partir del nombre del empleado
function iniciales(nombre) {
  const partes = nombre.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

export default function Sidebar({ empleado, onSave }) {
  // Modo edición del perfil
  const [editando, setEditando] = useState(false)
  // Borrador local mientras se edita (no se aplica hasta "Guardar")
  const [borrador, setBorrador] = useState(empleado)
  const fileInputRef = useRef(null)

  // Abre el modo edición copiando los valores actuales al borrador
  function abrirEdicion() {
    setBorrador(empleado)
    setEditando(true)
  }

  // Guarda el borrador → se propaga a todo el dashboard y al system prompt
  function guardar() {
    const nombreFinal = borrador.nombre.trim() || 'Empleado/a'
    onSave({ ...borrador, nombre: nombreFinal })
    setEditando(false)
  }

  // Lee la imagen subida y la guarda como dataURL en el borrador
  function onFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setBorrador((b) => ({ ...b, foto: reader.result }))
    reader.readAsDataURL(file)
  }

  return (
    <aside style={styles.sidebar}>
      {/* ---------- Bloque de perfil ---------- */}
      <div style={styles.profile}>
        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>
            {empleado.foto ? (
              <img src={empleado.foto} alt={empleado.nombre} style={styles.avatarImg} />
            ) : (
              <span style={styles.avatarInit}>{iniciales(empleado.nombre)}</span>
            )}
          </div>
          {/* Punto verde pulsante */}
          <span className="status-dot" style={styles.avatarDot} />
        </div>

        {!editando ? (
          <>
            <h1 style={styles.nombre}>{empleado.nombre}</h1>
            <p style={styles.rol}>Empleado/a de Recursos Humanos</p>
            <p style={styles.empresa}>Reformas Europa S.L.</p>
            <div style={styles.estadoLinea}>
              <span className="status-dot status-dot--sm" />
              <span style={styles.estadoTexto}>Trabajando ahora</span>
            </div>
            <p style={styles.incorporado}>Incorporado/a hace 1 mes</p>
            <button style={styles.editBtn} onClick={abrirEdicion}>
              Editar perfil
            </button>
          </>
        ) : (
          /* ---------- Modo edición ---------- */
          <div style={styles.editForm}>
            <label style={styles.editLabel}>Nombre del empleado</label>
            <input
              style={styles.editInput}
              value={borrador.nombre}
              onChange={(e) => setBorrador((b) => ({ ...b, nombre: e.target.value }))}
              placeholder="Nombre del empleado"
              autoFocus
            />

            <label style={styles.editLabel}>Foto</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFoto}
              style={{ display: 'none' }}
            />
            <button style={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
              {borrador.foto ? 'Cambiar foto' : 'Subir imagen'}
            </button>

            <div style={styles.editActions}>
              <button style={styles.saveBtn} onClick={guardar}>
                Guardar
              </button>
              <button style={styles.cancelBtn} onClick={() => setEditando(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Stats de hoy ---------- */}
      <Section titulo="Stats de hoy">
        {STATS_HOY.map((s) => (
          <Row key={s.label} label={s.label} valor={s.valor} color={s.color} />
        ))}
      </Section>

      {/* ---------- Estado del equipo ---------- */}
      <Section titulo="Estado del equipo">
        {ESTADO_EQUIPO.map((s) => (
          <Row key={s.label} label={s.label} valor={s.valor} color={s.color} dot />
        ))}
      </Section>

      {/* ---------- Alertas ---------- */}
      <Section titulo="Alertas">
        {ALERTAS.map((s) => (
          <Row key={s.label} label={`⚠️ ${s.label}`} valor={s.valor} color={s.color} />
        ))}
      </Section>
    </aside>
  )
}

// Bloque con título de sección
function Section({ titulo, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{titulo}</h2>
      <div style={styles.sectionBody}>{children}</div>
    </div>
  )
}

// Fila de estadística (label izquierda, valor derecha)
function Row({ label, valor, color, dot }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>
        {dot && (
          <span
            style={{ ...styles.rowDot, background: color }}
          />
        )}
        {label}
      </span>
      <span style={{ ...styles.rowValor, color }}>{valor}</span>
    </div>
  )
}

const styles = {
  sidebar: {
    width: '260px',
    flexShrink: 0,
    height: '100vh',
    background: '#0F1117',
    borderRight: '1px solid #1E2130',
    padding: '24px 18px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  // --- Perfil ---
  profile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid #1E2130',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: '14px',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '2px solid #1E2130',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarInit: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#fff',
  },
  avatarDot: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    border: '2px solid #0F1117',
  },
  nombre: {
    fontSize: '19px',
    fontWeight: 700,
    color: '#E5E7EB',
    marginBottom: '4px',
  },
  rol: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#6366F1',
    marginBottom: '2px',
  },
  empresa: {
    fontSize: '12px',
    color: '#8A90A2',
    marginBottom: '10px',
  },
  estadoLinea: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
  estadoTexto: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#10B981',
  },
  incorporado: {
    fontSize: '11px',
    color: '#8A90A2',
    marginBottom: '14px',
  },
  editBtn: {
    width: '100%',
    background: 'transparent',
    border: '1px solid #1E2130',
    color: '#E5E7EB',
    fontSize: '13px',
    fontWeight: 600,
    padding: '9px 12px',
    borderRadius: '8px',
  },
  // --- Formulario de edición ---
  editForm: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textAlign: 'left',
  },
  editLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8A90A2',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginTop: '4px',
  },
  editInput: {
    background: '#0B0D14',
    border: '1px solid #1E2130',
    borderRadius: '8px',
    color: '#E5E7EB',
    fontSize: '14px',
    padding: '9px 11px',
    outline: 'none',
  },
  uploadBtn: {
    background: 'transparent',
    border: '1px dashed #2A2E42',
    color: '#8A90A2',
    fontSize: '13px',
    fontWeight: 600,
    padding: '9px 12px',
    borderRadius: '8px',
  },
  editActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  },
  saveBtn: {
    flex: 1,
    background: '#6366F1',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    padding: '9px 12px',
    borderRadius: '8px',
  },
  cancelBtn: {
    flex: 1,
    background: 'transparent',
    border: '1px solid #1E2130',
    color: '#8A90A2',
    fontSize: '13px',
    fontWeight: 600,
    padding: '9px 12px',
    borderRadius: '8px',
  },
  // --- Secciones ---
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#8A90A2',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  sectionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#0B0D14',
    border: '1px solid #1E2130',
    borderRadius: '8px',
    padding: '9px 11px',
  },
  rowLabel: {
    fontSize: '12.5px',
    color: '#E5E7EB',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  rowDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  rowValor: {
    fontSize: '15px',
    fontWeight: 700,
  },
}
