const { ipcMain } = require('electron')

if (!ipcMain.handle) {
  const { createValue, parseValue } = require('./util.js')

  const _invokeHandlers = new Map()

  ipcMain.handle = ipcMain.handle || function (method, fn) {
    if (_invokeHandlers.has(method)) {
      throw new Error(`Attempted to register a second handler for '${method}'`)
    }

    if (typeof fn !== 'function') {
      throw new Error(`Expected handler to be a function, but found type '${typeof fn}'`)
    }

    _invokeHandlers.set(method, async (e, oid, ...args) => {
      try {
        e.sender.send('__ipc_invoked__', oid, parseValue(null), parseValue(await Promise.resolve(fn(e, ...(args.map(v => createValue(v)))))))
      } catch (err) {
        e.sender.send('__ipc_invoked__', oid, parseValue(err), parseValue(undefined))
      }
    })
  }

  ipcMain.removeHandler = ipcMain.removeHandler || function (method) {
    _invokeHandlers.delete(method)
  }

  ipcMain.handleOnce = ipcMain.handleOnce || function (method, fn) {
    ipcMain.handle(method, (e, ...args) => {
      ipcMain.removeHandler(method)
      return fn(e, ...args)
    })
  }

  ipcMain.on('__ipc_invoke__', function (event, oid, method, ...args) {
    if (_invokeHandlers.has(method)) {
      _invokeHandlers.get(method)(event, oid, ...args)
    } else {
      const msg = `No handler registered for '${method}'`
      console.log(`Error occurred in handler for '${method}': ${msg}`)
      event.sender.send('__ipc_invoked__', oid, parseValue(new Error(`Error invoking remote method '${method}': ${msg}`)), parseValue(undefined))
    }
  })

  global.__electron_ipc_handle_invoke__ = true
}
