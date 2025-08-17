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

      {/* Window controls with larger hit areas; explicitly no-drag */}
      <div className="yupomo-traffic" data-tauri-no-drag aria-label="Window controls">
        <span className="yupomo-tb-hit" data-tauri-no-drag>
          <button className="yupomo-tb-btn close" data-tauri-no-drag onClick={() => appWindow.close()} aria-label="Close" />
        </span>
        <span className="yupomo-tb-hit" data-tauri-no-drag>
          <button className="yupomo-tb-btn min" data-tauri-no-drag onClick={() => appWindow.minimize()} aria-label="Minimize" />
        </span>
        <span className="yupomo-tb-hit" data-tauri-no-drag>
          <button className="yupomo-tb-btn max" data-tauri-no-drag onClick={toggleMax} aria-label="Maximize" />
        </span>
      </div>

      {/* The rest of the titlebar is drag region */}
      <div className="flex-1 h-full" data-tauri-drag-region onMouseDown={handleDragMouseDown} />
    </div>
  )
}
