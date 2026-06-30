# Empleado de RRHH IA — Reformas Europa S.L.

Demo visual (sin backend) de un **Empleado de Recursos Humanos IA** para la
empresa ficticia *Reformas Europa S.L.* (reformas en Madrid). Forma parte de la
misma familia de productos que el Empleado de Atención al Cliente: comparte
diseño, paleta, tipografía y arquitectura de componentes.

## Tecnología

- **React + Vite**
- **Sin backend** — todos los datos son constantes definidas al principio de
  cada componente.
- **API de Anthropic** llamada directamente desde el frontend para el chat.

## Estructura

```
/src
  App.jsx                  Componente principal (layout 3 columnas + tabs)
  index.css                Estilos globales (tema, scrollbar, animaciones)
  main.jsx                 Punto de entrada
  /components
    Sidebar.jsx            Perfil editable + stats + estado equipo + alertas
    CandidatosList.jsx     Tab "Candidatos"
    EquipoList.jsx         Tab "Equipo"
    OnboardingList.jsx     Tab "Onboarding" (items expandibles)
    Chat.jsx               Chat con la API de Anthropic
index.html
.env.example
vite.config.js
package.json
```

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la clave de la API
cp .env.example .env
# y edita .env con tu VITE_ANTHROPIC_API_KEY

# 3. Arrancar en desarrollo
npm run dev
```

La app abre en `http://localhost:5173`.

## Personalización del empleado

Desde el sidebar, con el botón **"Editar perfil"**, el empresario puede cambiar
el **nombre** y la **foto** del empleado. Al guardar, el nombre se actualiza en
todo el dashboard y en el *system prompt* del chat.

## Configuración del chat

- Clave: `import.meta.env.VITE_ANTHROPIC_API_KEY`
- Modelo: `claude-sonnet-4-6`
- Max tokens: `1000`
- Historial de conversación mantenido en `useRef`.

> Nota: este es un proyecto de demostración. La clave de la API se usa
> directamente en el navegador con la cabecera
> `anthropic-dangerous-direct-browser-access`, lo cual **no es recomendable en
> producción** — sirve únicamente para la demo visual.
