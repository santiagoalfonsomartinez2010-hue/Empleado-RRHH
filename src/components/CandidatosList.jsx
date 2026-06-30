/* ============================================================
   CandidatosList.jsx — Tab "Candidatos"
   Lista de 8 candidatos. Cada candidato es una card idéntica a
   los tickets del empleado de atención al cliente:
   iniciales en círculo de color, nombre + puesto, badge de
   estado con color, puntuación IA y hora de recepción del CV.
   Los colores de los badges son idénticos a los estados de
   tickets (verde/amarillo/rojo).
   ============================================================ */

// Estados posibles con su color/badge (idénticos a los estados de tickets)
const ESTADOS = {
  ENCAJA: { label: '🟢 ENCAJA', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  POSIBLE: { label: '🟡 POSIBLE', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  NO_ENCAJA: { label: '🔴 NO ENCAJA', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
}

// --- Datos constantes (demo sin backend) ---
const CANDIDATOS = [
  {
    id: 1,
    nombre: 'José Fernández Ruiz',
    puesto: 'Oficial 1ª Albañilería',
    puntuacion: 92,
    estado: 'ENCAJA',
    motivo: '12 años experiencia, disponible inmediata',
    siguiente: 'Entrevista jueves 3 julio 10:00h',
    horaCV: '08:32',
  },
  {
    id: 2,
    nombre: 'Carlos Peña Martínez',
    puesto: 'Encargado de Obra',
    puntuacion: 88,
    estado: 'ENCAJA',
    motivo: '15 años, perfil senior obra Serrano',
    siguiente: 'Escalado a dirección',
    horaCV: '09:15',
  },
  {
    id: 3,
    nombre: 'Andrés Moreno López',
    puesto: 'Oficial 2ª Albañilería',
    puntuacion: 61,
    estado: 'POSIBLE',
    motivo: 'Poca experiencia pero precio ajustado',
    siguiente: 'Segunda revisión',
    horaCV: '10:44',
  },
  {
    id: 4,
    nombre: 'Laura Gómez Sánchez',
    puesto: 'Administrativa',
    puntuacion: 58,
    estado: 'POSIBLE',
    motivo: 'No es perfil actual, guardar para futuro',
    siguiente: 'Archivar para vacante admin',
    horaCV: '11:20',
  },
  {
    id: 5,
    nombre: 'María Rodríguez',
    puesto: 'Sin experiencia en obra',
    puntuacion: 18,
    estado: 'NO_ENCAJA',
    motivo: 'Sin experiencia relevante',
    siguiente: 'Email rechazo enviado ✅',
    horaCV: '09:50',
  },
  {
    id: 6,
    nombre: 'Roberto Vega',
    puesto: 'Oficial 1ª',
    puntuacion: 22,
    estado: 'NO_ENCAJA',
    motivo: 'Pretensión 52.000€ fuera de rango',
    siguiente: 'Email rechazo enviado ✅',
    horaCV: '10:10',
  },
  {
    id: 7,
    nombre: 'Ana Martínez',
    puesto: 'Administrativa',
    puntuacion: 15,
    estado: 'NO_ENCAJA',
    motivo: 'Busca trabajo de oficina, no obra',
    siguiente: 'Email rechazo enviado ✅',
    horaCV: '11:05',
  },
  {
    id: 8,
    nombre: 'Pablo Torres',
    puesto: 'Peón',
    puntuacion: 20,
    estado: 'NO_ENCAJA',
    motivo: 'Sin carnet de conducir (requisito)',
    siguiente: 'Email rechazo enviado ✅',
    horaCV: '12:30',
  },
]

// Paleta de colores para el círculo de iniciales (rotativa por candidato)
const CIRCLE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6']

function iniciales(nombre) {
  const partes = nombre.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

export default function CandidatosList() {
  return (
    <div style={styles.list}>
      {CANDIDATOS.map((c, i) => {
        const estado = ESTADOS[c.estado]
        const circle = CIRCLE_COLORS[i % CIRCLE_COLORS.length]
        return (
          <article key={c.id} style={styles.card}>
            {/* Cabecera: iniciales + nombre/puesto + badge */}
            <div style={styles.head}>
              <div style={{ ...styles.circle, background: circle }}>{iniciales(c.nombre)}</div>
              <div style={styles.headInfo}>
                <h3 style={styles.nombre}>{c.nombre}</h3>
                <p style={styles.puesto}>{c.puesto}</p>
              </div>
              <span style={{ ...styles.badge, color: estado.color, background: estado.bg }}>
                {estado.label}
              </span>
            </div>

            {/* Motivo de la valoración IA */}
            <p style={styles.motivo}>{c.motivo}</p>

            {/* Pie: puntuación + siguiente paso + hora CV */}
            <div style={styles.foot}>
              <span style={{ ...styles.score, color: estado.color }}>
                {c.puntuacion}/100
              </span>
              <span style={styles.siguiente}>{c.siguiente}</span>
              <span style={styles.hora}>CV {c.horaCV}</span>
            </div>
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
  puesto: {
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
  motivo: {
    fontSize: '13px',
    color: '#B6BCCD',
    lineHeight: 1.5,
  },
  foot: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    paddingTop: '4px',
    borderTop: '1px solid #1E2130',
  },
  score: {
    fontSize: '14px',
    fontWeight: 700,
  },
  siguiente: {
    flex: 1,
    fontSize: '12px',
    color: '#8A90A2',
    minWidth: '120px',
  },
  hora: {
    fontSize: '11.5px',
    color: '#6B7180',
    marginLeft: 'auto',
  },
}
