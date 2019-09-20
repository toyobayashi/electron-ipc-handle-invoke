import 'electron'

declare module 'electron' {
  interface IpcRenderer {
    invoke(channel: string, ...args: any[]): Promise<any>;
  }
}
