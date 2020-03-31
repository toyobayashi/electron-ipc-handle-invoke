import 'electron'

declare module 'electron' {
  interface IpcMainInvokeEvent extends Event {
    frameId: number;
    sender: WebContents;
  }
  interface IpcMain {
    handle (channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void
    handleOnce (channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<void>) | (any)): void
    removeHandler (channel: string): void
  }
}
