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

``` js
require('@tybys/electron-ipc-handle-invoke/main.js')
const { ipcMain } = require('electron')

ipcMain.handle('doSomething', (e, msg) => {
  return msg
})
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

``` js
require('@tybys/electron-ipc-handle-invoke/renderer.js')
const { ipcRenderer } = require('electron')

ipcRenderer.invoke('doSomething', 'message').then(res => {
  console.log(res === 'message') // true
}).catch(err => {
  console.log(err)
})
```
