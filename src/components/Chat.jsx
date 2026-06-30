import { useEffect, useRef, useState } from 'react'

/* ============================================================
   Chat.jsx — Columna derecha (380px)
   Chat con el empleado de RRHH. Idéntico al chat del empleado
   de atención al cliente:
     · Header con avatar pequeño + nombre + "Trabajando ahora"
     · Área de mensajes con scroll
     · Burbujas: usuario derecha violeta / empleado izquierda gris
     · Animación de typing con 3 puntos
     · Input + botón enviar (Enter envía, Shift+Enter nueva línea)
   Llama directamente a la API de Anthropic desde el frontend.
   ============================================================ */

// Configuración de la API de Anthropic
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 1000

// Mensaje inicial que muestra el empleado al cargar la app
const MENSAJE_INICIAL =
  'Buenos días. Hoy he revisado 8 CVs nuevos para la vacante de oficial de primera. ' +
  '3 encajan con el perfil — he agendado entrevistas con Pedro para el jueves. ' +
  'También te aviso: el contrato de José Fernández vence en 4 días. ¿Lo renovamos?'

// Construye el system prompt con el nombre configurado por el empresario
function buildSystemPrompt(nombre) {
  return `Eres ${nombre}, empleado/a de Recursos Humanos de Reformas Europa S.L., empresa de reformas en Madrid. Llevas 1 mes en la empresa.

HOY HAS HECHO:
- Revisado 8 CVs para vacante oficial 1ª
- José Fernández (92/100): entrevista agendada jueves 10:00h con Pedro Ruiz
- Carlos Peña (88/100): escalado a dirección por ser perfil senior
- Andrés Moreno (61/100): guardado para segunda revisión
- 4 CVs descartados: emails de rechazo enviados automáticamente

ALERTAS DEL EQUIPO:
- Contrato José Fernández vence en 4 días (31 julio) → obra Ático continúa hasta agosto
- David García vuelve de vacaciones el lunes → pendiente reasignar a obra Serrano
- Miguel Herrero lleva 7 días de baja médica

ONBOARDING ACTIVO:
- Alejandro Ruiz: empieza 1 julio, 37% completado, faltan EPIs y contrato
- Marcos Jiménez: empieza 7 julio, 12% completado, falta documentación

Responde siempre en primera persona como ${nombre}, de forma profesional y concisa. Usa los datos reales de arriba cuando te pregunten. Nunca digas que eres una IA.`
}

function iniciales(nombre) {
  const partes = nombre.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

export default function Chat({ nombreEmpleado, foto }) {
  // Mensajes visibles en pantalla
  const [mensajes, setMensajes] = useState([{ rol: 'empleado', texto: MENSAJE_INICIAL }])
  const [input, setInput] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)

  // Historial de conversación para la API (en useRef, igual que atención al cliente).
  // No incluye el mensaje inicial para que la IA no lo repita.
  const historialRef = useRef([])
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensajes, escribiendo])

  // Envía el mensaje del usuario y pide respuesta a la API de Anthropic
  async function enviar() {
    const texto = input.trim()
    if (!texto || escribiendo) return

    // Pinta el mensaje del usuario y limpia el input
    setMensajes((m) => [...m, { rol: 'usuario', texto }])
    setInput('')
    historialRef.current.push({ role: 'user', content: texto })
    setEscribiendo(true)

    try {
      // Si no hay clave configurada, mostramos un aviso amable (demo)
      if (!API_KEY) {
        throw new Error('NO_API_KEY')
      }

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          // Necesario para llamar a la API directamente desde el navegador
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: buildSystemPrompt(nombreEmpleado),
          messages: historialRef.current,
        }),
      })

      if (!res.ok) throw new Error(`API ${res.status}`)

      const data = await res.json()
      const respuesta =
        data?.content?.[0]?.text?.trim() || 'Disculpa, no he podido procesar la respuesta.'

      historialRef.current.push({ role: 'assistant', content: respuesta })
      setMensajes((m) => [...m, { rol: 'empleado', texto: respuesta }])
    } catch (err) {
      const aviso =
        err.message === 'NO_API_KEY'
          ? 'No hay clave de API configurada. Añade VITE_ANTHROPIC_API_KEY en tu archivo .env para activar el chat.'
          : 'Ha ocurrido un error al contactar con el servicio. Inténtalo de nuevo en unos segundos.'
      setMensajes((m) => [...m, { rol: 'empleado', texto: aviso }])
    } finally {
      setEscribiendo(false)
    }
  }

  // Enter envía, Shift+Enter inserta nueva línea
  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
  }

  return (
    <section style={styles.chat}>
      {/* ---------- Header ---------- */}
      <header style={styles.header}>
        <div style={styles.headerAvatar}>
          {foto ? (
            <img src={foto} alt={nombreEmpleado} style={styles.headerAvatarImg} />
          ) : (
            <span style={styles.headerInit}>{iniciales(nombreEmpleado)}</span>
          )}
        </div>
        <div style={styles.headerInfo}>
          <h2 style={styles.headerNombre}>{nombreEmpleado}</h2>
          <div style={styles.headerEstado}>
            <span className="status-dot status-dot--sm" />
            <span style={styles.headerEstadoTexto}>Trabajando ahora</span>
          </div>
        </div>
      </header>

      {/* ---------- Área de mensajes ---------- */}
      <div style={styles.mensajes} ref={scrollRef}>
        {mensajes.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.burbujaWrap,
              justifyContent: m.rol === 'usuario' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                ...styles.burbuja,
                ...(m.rol === 'usuario' ? styles.burbujaUsuario : styles.burbujaEmpleado),
              }}
            >
              {m.texto}
            </div>
          </div>
        ))}

        {/* Animación de typing con 3 puntos */}
        {escribiendo && (
          <div style={{ ...styles.burbujaWrap, justifyContent: 'flex-start' }}>
            <div style={{ ...styles.burbuja, ...styles.burbujaEmpleado, ...styles.typing }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      {/* ---------- Input ---------- */}
      <div style={styles.inputBar}>
        <textarea
          ref={textareaRef}
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escribe un mensaje…"
          rows={1}
        />
        <button
          style={{ ...styles.sendBtn, opacity: input.trim() && !escribiendo ? 1 : 0.5 }}
          onClick={enviar}
          disabled={!input.trim() || escribiendo}
        >
          ➤
        </button>
      </div>
    </section>
  )
}

const styles = {
  chat: {
    width: '380px',
    flexShrink: 0,
    height: '100vh',
    background: '#0F1117',
    display: 'flex',
    flexDirection: 'column',
  },
  // --- Header ---
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 18px',
    borderBottom: '1px solid #1E2130',
  },
  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  headerAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  headerInit: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#fff',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  headerNombre: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#E5E7EB',
  },
  headerEstado: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  headerEstadoTexto: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#10B981',
  },
  // --- Mensajes ---
  mensajes: {
    flex: 1,
    overflowY: 'auto',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: 0,
  },
  burbujaWrap: {
    display: 'flex',
    width: '100%',
  },
  burbuja: {
    maxWidth: '82%',
    padding: '10px 13px',
    borderRadius: '14px',
    fontSize: '13.5px',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  burbujaUsuario: {
    background: '#6366F1',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  burbujaEmpleado: {
    background: '#161922',
    color: '#E5E7EB',
    border: '1px solid #1E2130',
    borderBottomLeftRadius: '4px',
  },
  typing: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '13px 15px',
  },
  // --- Input ---
  inputBar: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    padding: '14px 16px',
    borderTop: '1px solid #1E2130',
  },
  textarea: {
    flex: 1,
    background: '#0B0D14',
    border: '1px solid #1E2130',
    borderRadius: '12px',
    color: '#E5E7EB',
    fontSize: '13.5px',
    padding: '11px 13px',
    resize: 'none',
    outline: 'none',
    maxHeight: '120px',
    lineHeight: 1.4,
  },
  sendBtn: {
    width: '42px',
    height: '42px',
    flexShrink: 0,
    background: '#6366F1',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
