# electron-ipc-handle-invoke

`ipcMain.handle()` and `ipcRenderer.invoke()` polyfill.

## Usage

``` bash
$ npm install @tybys/electron-ipc-handle-invoke
```

### Main

``` ts
import 'electron'

declare module 'electron' {
  interface IpcMain {
    handle (channel: string, listener: (event: any, ...args: any[]) => (Promise<void>) | (any)): void
    handleOnce (channel: string, listener: (event: any, ...args: any[]) => (Promise<void>) | (any)): void
    removeHandler (channel: string): void
  }
}
```

### Renderer

``` ts
import 'electron'

declare module 'electron' {
  interface IpcRenderer {
    invoke(channel: string, ...args: any[]): Promise<any>;
  }
}
```
