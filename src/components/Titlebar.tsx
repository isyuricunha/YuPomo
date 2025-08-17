import { appWindow } from '@tauri-apps/api/window'
import type { MouseEvent } from 'react'

// Render only in Tauri desktop
const isTauri = typeof window !== 'undefined' && '__TAURI_IPC__' in window

export default function Titlebar() {
  if (!isTauri) return null

  const toggleMax = async () => {
    if (await appWindow.isMaximized()) await appWindow.unmaximize()
    else await appWindow.maximize()
  }

  // Programmatic drag fallback for Windows/WebView2
  const handleDragMouseDown = async (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // left click only
    const target = e.target as Element | null
    if (target && target.closest('[data-tauri-no-drag]')) return
    try {
      await appWindow.startDragging()
    } catch {}
  }

  return (
    <div className="yupomo-titlebar" data-tauri-drag-region onDoubleClick={toggleMax}>
      {/* Tiny drag strip across the very top for easy dragging */}
      <div className="yupomo-drag-strip" data-tauri-drag-region onMouseDown={handleDragMouseDown} />

      {/* Window controls with larger hit areas; explicitly no-drag (Windows order: Minimize, Maximize, Close) */}
      <div className="yupomo-traffic" data-tauri-no-drag aria-label="Window controls">
        <span className="yupomo-tb-hit" data-tauri-no-drag>
          <button className="yupomo-tb-btn min" data-tauri-no-drag onClick={() => appWindow.minimize()} aria-label="Minimize">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>
        </span>
        <span className="yupomo-tb-hit" data-tauri-no-drag>
          <button className="yupomo-tb-btn max" data-tauri-no-drag onClick={toggleMax} aria-label="Maximize">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
              <rect x="6" y="6" width="12" height="12" rx="1" ry="1" />
            </svg>
          </button>
        </span>
        <span className="yupomo-tb-hit" data-tauri-no-drag>
          <button className="yupomo-tb-btn close" data-tauri-no-drag onClick={() => appWindow.close()} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </span>
      </div>

      {/* The rest of the titlebar is drag region */}
      <div className="flex-1 h-full" data-tauri-drag-region onMouseDown={handleDragMouseDown} />
    </div>
  )
}
