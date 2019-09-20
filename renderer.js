const { ipcRenderer } = require('electron')

if (!ipcRenderer.invoke) {
  const ObjectId = require('@tybys/oid')
  const { createValue, parseValue } = require('./util.js')

  const _invokeResults = new Map()

  ipcRenderer.invoke = ipcRenderer.invoke || function (method, ...args) {
    return new Promise((resolve, reject) => {
      const id = (new ObjectId()).toString()
      _invokeResults.set(id, { resolve, reject })
      ipcRenderer.send('__ipc_invoke__', id, method, ...(args.map(v => parseValue(v))))
    })
  }

  ipcRenderer.on('__ipc_invoked__', (_event, oid, err, result) => {
    const defer = _invokeResults.get(oid)
    if (createValue(err)) {
      defer.reject(createValue(err))
    } else {
      defer.resolve(createValue(result))
    }
    defer.reject = null
    defer.resolve = null
    _invokeResults.delete(oid)
  })
}
