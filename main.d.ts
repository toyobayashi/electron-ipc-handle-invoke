import 'electron'

declare module 'electron' {
  interface IpcMain {
    handle (channel: string, listener: (event: any, ...args: any[]) => (Promise<void>) | (any)): void
    handleOnce (channel: string, listener: (event: any, ...args: any[]) => (Promise<void>) | (any)): void
    removeHandler (channel: string): void
  }
}
