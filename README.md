# IntegrIApp — Plataforma de Automatizaciones Inteligentes
## IntegrIA Solutions

Plataforma web para gestión y ejecución de flujos de automatización inteligente. Permite a equipos operativos ejecutar procesos automatizados de extracción, procesamiento y carga de información sin conocimientos técnicos.

## Tecnologías
- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (autenticación y base de datos)
- Automatizaciones inteligentes vía API

## Módulos disponibles
- Extracción de Facturas (PDF, XML, imagen)
- Causación Contable
- Descarga DIAN (RPA)
- Servicios Públicos
- Combustible & Rutas
- Leads Comerciales

## Desarrollo local
```bash
npm install
npm run dev
```

## Variables de entorno requeridas (.env.local)
```
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key
```

## Roles de usuario
- Administrador: acceso total
- Operador: ejecutar flujos
- Visualizador: solo consulta
- Cliente: flujos asignados específicos
