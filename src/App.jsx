import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import CandidatosList from './components/CandidatosList.jsx'
import EquipoList from './components/EquipoList.jsx'
import OnboardingList from './components/OnboardingList.jsx'
import Chat from './components/Chat.jsx'

/* ============================================================
   App.jsx — Componente principal del Empleado de RRHH IA
   Reformas Europa S.L. (demo visual, sin backend)

   Layout de 3 columnas fijas sin scroll exterior:
     · Columna 1: Sidebar (260px) — perfil editable + stats
     · Columna 2: Panel central (flex:1) — 3 tabs
     · Columna 3: Chat (380px) — API de Anthropic
   ============================================================ */

// Tabs del panel central (mismo estilo de tabs que atención al cliente)
const TABS = [
  { id: 'candidatos', label: 'Candidatos' },
  { id: 'equipo', label: 'Equipo' },
  { id: 'onboarding', label: 'Onboarding' },
]

export default function App() {
  // Tab activa del panel central
  const [activeTab, setActiveTab] = useState('candidatos')

  // Personalización del empleado (el empresario la edita desde el sidebar).
  // El nombre y la foto se propagan a todo el dashboard y al system prompt del chat.
  const [empleado, setEmpleado] = useState({
    nombre: 'Marta',
    foto: null, // dataURL de la imagen subida, o null para usar iniciales
  })

  return (
    <div style={styles.app}>
      {/* COLUMNA 1 — Sidebar izquierdo */}
      <Sidebar empleado={empleado} onSave={setEmpleado} />

      {/* COLUMNA 2 — Panel central con tabs */}
      <main style={styles.center}>
        {/* Cabecera con las tabs navegables */}
        <div style={styles.tabsBar}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(active ? styles.tabActive : {}),
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Contenido de la tab activa (con scroll interior propio) */}
        <div style={styles.tabContent}>
          {activeTab === 'candidatos' && <CandidatosList />}
          {activeTab === 'equipo' && <EquipoList />}
          {activeTab === 'onboarding' && <OnboardingList />}
        </div>
      </main>

      {/* COLUMNA 3 — Chat con el empleado de RRHH */}
      <Chat nombreEmpleado={empleado.nombre} foto={empleado.foto} />
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    background: '#0B0D14',
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    background: '#0B0D14',
    borderLeft: '1px solid #1E2130',
    borderRight: '1px solid #1E2130',
  },
  // Barra de tabs superior
  tabsBar: {
    display: 'flex',
    gap: '4px',
    padding: '16px 20px 0',
    borderBottom: '1px solid #1E2130',
  },
  tab: {
    background: 'transparent',
    border: 'none',
    color: '#8A90A2',
    fontSize: '14px',
    fontWeight: 600,
    padding: '10px 16px',
    borderRadius: '8px 8px 0 0',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
  },
  tabActive: {
    color: '#E5E7EB',
    borderBottom: '2px solid #6366F1',
  },
  tabContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    minHeight: 0,
  },
}
