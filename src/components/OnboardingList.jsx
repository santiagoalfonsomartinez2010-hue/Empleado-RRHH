import { useState } from 'react'

/* ============================================================
   OnboardingList.jsx — Tab "Onboarding"
   Lista expandible (mismo patrón que las obras del empleado de
   contabilidad / Elena): por defecto cerradas, al hacer click
   se expande mostrando el checklist completo.
   Cada incorporación muestra una barra de progreso con color
   según el porcentaje completado.
   ============================================================ */

// --- Datos constantes (demo sin backend) ---
const ONBOARDINGS = [
  {
    id: 1,
    nombre: 'Alejandro Ruiz',
    puesto: 'Oficial 1ª Electricidad',
    fecha: '1 julio 2026',
    obra: 'Local Calle Serrano',
    estado: 'En curso',
    estadoColor: '#F59E0B',
    progreso: 3,
    total: 8,
    porcentaje: 37,
    barraColor: '#F59E0B', // amarillo
    checklist: [
      { hecho: true, texto: 'Email de bienvenida enviado' },
      { hecho: true, texto: 'Documentación solicitada (DNI, SS, cuenta)' },
      { hecho: true, texto: 'Reunión con Pedro Ruiz agendada (30 junio)' },
      { hecho: false, texto: 'Entrega de EPIs (cascos, botas, guantes)' },
      { hecho: false, texto: 'Firma de contrato' },
      { hecho: false, texto: 'Alta en Seguridad Social' },
      { hecho: false, texto: 'Acceso a grupo WhatsApp del equipo' },
      { hecho: false, texto: 'Formación PRL básica obligatoria (16h)' },
    ],
  },
  {
    id: 2,
    nombre: 'Marcos Jiménez',
    puesto: 'Peón',
    fecha: '7 julio 2026',
    obra: 'Local Calle Serrano',
    estado: 'Pendiente',
    estadoColor: '#EF4444',
    progreso: 1,
    total: 8,
    porcentaje: 12,
    barraColor: '#EF4444', // rojo
    checklist: [
      { hecho: true, texto: 'Email de bienvenida enviado' },
      { hecho: false, texto: 'Documentación pendiente de recibir' },
      { hecho: false, texto: 'Entrega de EPIs' },
      { hecho: false, texto: 'Firma de contrato' },
      { hecho: false, texto: 'Alta en Seguridad Social' },
      { hecho: false, texto: 'Acceso a grupo WhatsApp del equipo' },
      { hecho: false, texto: 'Reunión con jefe de obra' },
      { hecho: false, texto: 'Formación PRL básica obligatoria (16h)' },
    ],
  },
]

function iniciales(nombre) {
  const partes = nombre.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

export default function OnboardingList() {
  // IDs de las incorporaciones abiertas (por defecto todas cerradas)
  const [abiertas, setAbiertas] = useState([])

  function toggle(id) {
    setAbiertas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div style={styles.list}>
      {ONBOARDINGS.map((o, i) => {
        const open = abiertas.includes(o.id)
        const circle = i % 2 === 0 ? '#6366F1' : '#10B981'
        return (
          <article key={o.id} style={styles.card}>
            {/* Cabecera clicable que expande/colapsa el checklist */}
            <button
              style={styles.head}
              onClick={() => toggle(o.id)}
              aria-expanded={open}
            >
              <div style={{ ...styles.circle, background: circle }}>{iniciales(o.nombre)}</div>

              <div style={styles.headInfo}>
                <div style={styles.headTop}>
                  <h3 style={styles.nombre}>{o.nombre}</h3>
                  <span
                    style={{
                      ...styles.estadoBadge,
                      color: o.estadoColor,
                      background: `${o.estadoColor}1F`,
                    }}
                  >
                    {o.estado}
                  </span>
                </div>
                <p style={styles.puesto}>{o.puesto}</p>

                {/* Datos clave: fecha + obra */}
                <div style={styles.meta}>
                  <span style={styles.metaItem}>📅 {o.fecha}</span>
                  <span style={styles.metaItem}>🏗️ {o.obra}</span>
                </div>

                {/* Barra de progreso con color según porcentaje */}
                <div style={styles.progresoRow}>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: `${o.porcentaje}%`,
                        background: o.barraColor,
                      }}
                    />
                  </div>
                  <span style={{ ...styles.progresoTexto, color: o.barraColor }}>
                    {o.progreso}/{o.total} · {o.porcentaje}%
                  </span>
                </div>
              </div>

              {/* Chevron de expansión */}
              <span style={{ ...styles.chevron, transform: open ? 'rotate(90deg)' : 'none' }}>
                ›
              </span>
            </button>

            {/* Checklist expandido */}
            {open && (
              <div style={styles.checklist}>
                {o.checklist.map((item, idx) => (
                  <div key={idx} style={styles.checkItem}>
                    <span style={styles.checkIcon}>{item.hecho ? '✅' : '⏳'}</span>
                    <span
                      style={{
                        ...styles.checkText,
                        color: item.hecho ? '#B6BCCD' : '#8A90A2',
                      }}
                    >
                      {item.texto}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    background: '#0F1117',
    border: '1px solid #1E2130',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  head: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    textAlign: 'left',
  },
  circle: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
  headInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  headTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  nombre: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#E5E7EB',
  },
  estadoBadge: {
    fontSize: '10.5px',
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: '999px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  puesto: {
    fontSize: '12.5px',
    color: '#8A90A2',
  },
  meta: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '12px',
    color: '#B6BCCD',
  },
  progresoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '2px',
  },
  barTrack: {
    flex: 1,
    height: '6px',
    background: '#1E2130',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },
  progresoTexto: {
    fontSize: '11.5px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  chevron: {
    fontSize: '22px',
    color: '#8A90A2',
    lineHeight: 1,
    transition: 'transform 0.2s ease',
    flexShrink: 0,
    marginTop: '8px',
  },
  // --- Checklist expandido ---
  checklist: {
    borderTop: '1px solid #1E2130',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkIcon: {
    fontSize: '14px',
    flexShrink: 0,
  },
  checkText: {
    fontSize: '13px',
    lineHeight: 1.4,
  },
}
