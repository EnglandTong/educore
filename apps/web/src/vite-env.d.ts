/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the API (defaults to `/api/v1` when unset). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
