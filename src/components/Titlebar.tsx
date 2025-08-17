import { appWindow } from '@tauri-apps/api/window'

// Render only in Tauri desktop
const isTauri = typeof window !== 'undefined' && '__TAURI_IPC__' in window

export default function Titlebar() {
  if (!isTauri) return null

  const toggleMax = async () => {
    if (await appWindow.isMaximized()) await appWindow.unmaximize()
    else await appWindow.maximize()
  }

  return (
    <div className="yupomo-titlebar" data-tauri-drag-region onDoubleClick={toggleMax}>
      <div className="yupomo-traffic" aria-label="Window controls">
        <button className="yupomo-tb-btn close" data-tauri-no-drag onClick={() => appWindow.close()} aria-label="Close" />
        <button className="yupomo-tb-btn min" data-tauri-no-drag onClick={() => appWindow.minimize()} aria-label="Minimize" />
        <button className="yupomo-tb-btn max" data-tauri-no-drag onClick={toggleMax} aria-label="Maximize" />
      </div>
    </div>
  )
}
