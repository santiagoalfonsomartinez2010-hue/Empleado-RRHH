/* ============================================================
   EquipoList.jsx — Tab "Equipo"
   Lista del equipo completo de Reformas Europa. Mismo diseño de
   cards que los tickets/clientes del empleado de atención al
   cliente: iniciales en círculo, nombre + cargo, obra asignada,
   badge de estado (🟢 Trabajando / 🏖️ Vacaciones / 🤒 Baja) y
   alerta ⚠️ si el contrato vence pronto.

   El total cuadra con el sidebar: 14 trabajando · 2 vacaciones ·
   1 baja = 17 empleados.
   ============================================================ */

// Estados del empleado con su badge de color
const ESTADOS = {
  TRABAJANDO: { label: '🟢 Trabajando', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  VACACIONES: { label: '🏖️ Vacaciones', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  BAJA: { label: '🤒 Baja', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
}

// --- Datos constantes (demo sin backend) ---
const EQUIPO = [
  {
    id: 1,
    nombre: 'Carlos Meridiano',
    cargo: 'Fundador y Director',
    obra: null,
    estado: 'TRABAJANDO',
    contrato: 'Indefinido',
    nota: null,
    alerta: null,
  },
  {
    id: 2,
    nombre: 'Laura Sánchez',
    cargo: 'Administración',
    obra: null,
    estado: 'TRABAJANDO',
    contrato: 'Indefinido',
    nota: null,
    alerta: null,
  },
  {
    id: 3,
    nombre: 'Pedro Ruiz',
    cargo: 'Jefe de Obra',
    obra: 'Ático',
    estado: 'TRABAJANDO',
    contrato: 'Indefinido',
    nota: null,
    alerta: null,
  },
  {
    id: 4,
    nombre: 'Antonio Vega',
    cargo: 'Jefe de Obra',
    obra: 'Chamberí',
    estado: 'TRABAJANDO',
    contrato: 'Indefinido',
    nota: null,
    alerta: null,
  },
  {
    id: 5,
    nombre: 'José Fernández',
    cargo: 'Oficial 1ª Albañilería',
    obra: 'Ático',
    estado: 'TRABAJANDO',
    contrato: 'Indefinido',
    nota: null,
    alerta: 'Contrato vence en 4 días (31 julio)',
  },
  {
    id: 6,
    nombre: 'Manuel Torres',
    cargo: 'Oficial 1ª Azulejista',
    obra: 'Ático',
    estado: 'TRABAJANDO',
    contrato: 'Contrato obra · Vence 15 agosto',
    nota: null,
    alerta: null,
  },
  {
    id: 7,
    nombre: 'David García',
    cargo: 'Oficial 2ª Albañilería',
    obra: 'Serrano',
    estado: 'VACACIONES',
    contrato: 'Indefinido',
    nota: 'Vacaciones hasta 30 junio',
    alerta: 'Vuelve el lunes → reasignar obra Serrano',
  },
  {
    id: 8,
    nombre: 'Roberto Sanz',
    cargo: 'Peón',
    obra: 'Chamberí',
    estado: 'TRABAJANDO',
    contrato: 'Contrato obra · Vence 31 agosto',
    nota: null,
    alerta: null,
  },
  {
    id: 9,
    nombre: 'Miguel Herrero',
    cargo: 'Oficial 1ª Pintura',
    obra: null,
    estado: 'BAJA',
    contrato: 'Indefinido',
    nota: 'Baja médica desde 20 junio · Día 7 de baja',
    alerta: null,
  },
  {
    id: 10,
    nombre: 'Francisco López',
    cargo: 'Peón',
    obra: 'Chamberí',
    estado: 'TRABAJANDO',
    contrato: 'Contrato obra · Vence 30 septiembre',
    nota: null,
    alerta: null,
  },
  // --- Trabajadores adicionales (nombres españoles ficticios) ---
  {
    id: 11,
    nombre: 'Javier Domínguez',
    cargo: 'Oficial 1ª Fontanería',
    obra: 'Ático',
    estado: 'TRABAJANDO',
    contrato: 'Indefinido',
    nota: null,
    alerta: null,
  },
  {
    id: 12,
    nombre: 'Sergio Navarro',
    cargo: 'Oficial 2ª Electricidad',
    obra: 'Chamberí',
    estado: 'TRABAJANDO',
    contrato: 'Contrato obra · Vence 30 septiembre',
    nota: null,
    alerta: null,
  },
  {
    id: 13,
    nombre: 'Daniel Ortega',
    cargo: 'Peón',
    obra: 'Serrano',
    estado: 'TRABAJANDO',
    contrato: 'Contrato obra · Vence 31 octubre',
    nota: null,
    alerta: null,
  },
  {
    id: 14,
    nombre: 'Álvaro Castro',
    cargo: 'Oficial 1ª Carpintería',
    obra: 'Ático',
    estado: 'TRABAJANDO',
    contrato: 'Indefinido',
    nota: null,
    alerta: null,
  },
  {
    id: 15,
    nombre: 'Rubén Morales',
    cargo: 'Oficial 2ª Albañilería',
    obra: 'Chamberí',
    estado: 'TRABAJANDO',
    contrato: 'Contrato obra · Vence 30 noviembre',
    nota: null,
    alerta: null,
  },
  {
    id: 16,
    nombre: 'Iván Romero',
    cargo: 'Peón',
    obra: 'Ático',
    estado: 'TRABAJANDO',
    contrato: 'Contrato obra · Vence 31 agosto',
    nota: null,
    alerta: null,
  },
  {
    id: 17,
    nombre: 'Marco Gil',
    cargo: 'Oficial 1ª Pintura',
    obra: 'Serrano',
    estado: 'VACACIONES',
    contrato: 'Indefinido',
    nota: 'Vacaciones hasta 5 julio',
    alerta: null,
  },
]

const CIRCLE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899']

function iniciales(nombre) {
  const partes = nombre.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

export default function EquipoList() {
  return (
    <div style={styles.list}>
      {EQUIPO.map((e, i) => {
        const estado = ESTADOS[e.estado]
        const circle = CIRCLE_COLORS[i % CIRCLE_COLORS.length]
        return (
          <article key={e.id} style={styles.card}>
            {/* Cabecera: iniciales + nombre/cargo + badge de estado */}
            <div style={styles.head}>
              <div style={{ ...styles.circle, background: circle }}>{iniciales(e.nombre)}</div>
              <div style={styles.headInfo}>
                <h3 style={styles.nombre}>{e.nombre}</h3>
                <p style={styles.cargo}>{e.cargo}</p>
              </div>
              <span style={{ ...styles.badge, color: estado.color, background: estado.bg }}>
                {estado.label}
              </span>
            </div>

            {/* Detalles: obra asignada y contrato */}
            <div style={styles.meta}>
              {e.obra && (
                <span style={styles.metaItem}>
                  🏗️ Obra: <strong style={styles.metaStrong}>{e.obra}</strong>
                </span>
              )}
              <span style={styles.metaItem}>📄 {e.contrato}</span>
            </div>

            {/* Nota de estado (vacaciones / baja) */}
            {e.nota && <p style={styles.nota}>{e.nota}</p>}

            {/* Alerta de contrato / reasignación */}
            {e.alerta && (
              <div style={styles.alerta}>
                <span style={styles.alertaIcon}>⚠️</span>
                <span>{e.alerta}</span>
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
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  },
  nombre: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#E5E7EB',
  },
  cargo: {
    fontSize: '12.5px',
    color: '#8A90A2',
    marginTop: '2px',
  },
  badge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '5px 10px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '12.5px',
    color: '#B6BCCD',
  },
  metaStrong: {
    color: '#E5E7EB',
    fontWeight: 600,
  },
  nota: {
    fontSize: '12.5px',
    color: '#8A90A2',
  },
  alerta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(245,158,11,0.10)',
    border: '1px solid rgba(245,158,11,0.25)',
    borderRadius: '8px',
    padding: '8px 11px',
    fontSize: '12.5px',
    color: '#F59E0B',
    fontWeight: 500,
  },
  alertaIcon: {
    flexShrink: 0,
  },
}
