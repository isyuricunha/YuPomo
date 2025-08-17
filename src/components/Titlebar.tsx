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
      {/* Absolutely position window controls; mark as no-drag */}
      <div className="yupomo-traffic" data-tauri-no-drag aria-label="Window controls">
        <button className="yupomo-tb-btn close" data-tauri-no-drag onClick={() => appWindow.close()} aria-label="Close" />
        <button className="yupomo-tb-btn min" data-tauri-no-drag onClick={() => appWindow.minimize()} aria-label="Minimize" />
        <button className="yupomo-tb-btn max" data-tauri-no-drag onClick={toggleMax} aria-label="Maximize" />
      </div>
      {/* The rest of the titlebar is drag region */}
      <div className="flex-1 h-full" data-tauri-drag-region onMouseDown={handleDragMouseDown} />
    </div>
  )
}
