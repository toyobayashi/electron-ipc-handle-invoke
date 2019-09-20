import '../renderer'
import { ipcRenderer } from 'electron'

document.getElementById('button')!.addEventListener('click', async function () {
  console.log(await ipcRenderer.invoke('showArgs', 1, '2', true, [{ a: 1, b: '2', c: false }, undefined], { a: { aa: { aaa: 3 } } }, undefined, null, new Date()))
}, false)
