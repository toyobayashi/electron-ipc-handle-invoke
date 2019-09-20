import '../main'
import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from 'electron'
import { format } from 'url'
import { join } from 'path'

function isPromiseLike (obj: any) {
  return (obj instanceof Promise) || (
    obj !== undefined && obj !== null && typeof obj.then === 'function' && typeof obj.catch === 'function'
  )
}

class WindowManager {
  public static ID_MAIN_WINDOW: string = 'main-window'

  private static _instance: WindowManager

  public static getInstance (): WindowManager {
    if (!WindowManager._instance) {
      WindowManager._instance = new WindowManager()
    }
    return WindowManager._instance
  }

  public static createMainWindow (): void {
    const windowManager = WindowManager.getInstance()
    if (!windowManager.hasWindow(WindowManager.ID_MAIN_WINDOW)) {
      const browerWindowOptions: BrowserWindowConstructorOptions = {
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: true
        }
      }

      windowManager.createWindow(
        WindowManager.ID_MAIN_WINDOW,
        browerWindowOptions,
        format({
          pathname: join(__dirname, 'index.html'),
          protocol: 'file:',
          slashes: true
        })
      )
    }
  }

  public windows: Map<string, BrowserWindow>

  public constructor () {
    if (WindowManager._instance) {
      throw new Error('Can not create multiple WindowManager instances.')
    }
    this.windows = new Map()
  }

  public createWindow (name: string, browerWindowOptions: BrowserWindowConstructorOptions, url: string) {
    if (this.windows.has(name)) {
      throw new Error(`The window named "${name}" exists.`)
    }

    let win: BrowserWindow | null = new BrowserWindow(browerWindowOptions)

    win.on('ready-to-show', function () {
      if (!win) return
      win.show()
      win.focus()
      win.webContents.openDevTools()
    })

    win.on('closed', () => {
      win = null
      this.windows.delete(name)
    })

    this.windows.set(name, win)

    const res = win.loadURL(url)

    if (isPromiseLike(res)) {
      res.catch((err: any) => {
        console.log(err)
      })
    }
  }

  public getWindow (name: string): BrowserWindow {
    if (this.windows.has(name)) {
      return this.windows.get(name) as BrowserWindow
    }
    throw new Error(`The window named "${name} doesn't exists."`)
  }

  public removeWindow (name: string): void {
    if (!this.windows.has(name)) {
      throw new Error(`The window named "${name} doesn't exists."`)
    }
    (this.windows.get(name) as BrowserWindow).close()
  }

  public hasWindow (name: string): boolean {
    return this.windows.has(name)
  }
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  WindowManager.createMainWindow()
})

typeof app.whenReady === 'function' ? app.whenReady().then(main) : app.on('ready', main)

function main () {
  ipcMain.handle('showArgs', (_e, ...args) => {
    console.log(args)
    return args
  })
  WindowManager.createMainWindow()
}
