let tabsList = document.querySelector('#tabs-in-group')

let port = browser.runtime.connect({name: "panel-to-bg"})

port.postMessage({f: "test"})
port.postMessage({f: 'getTabsInGroup'})
port.onMessage.addListener(async function(m) {
  switch(m.f) {
    case "test":
      console.log('test: ', m.msg)
      break
    case "getTabsInGroup":  
      console.log('getTabsInGroup: ', m.msg)
      let listStr = ""      
      for (let key of m.msg.keys()) {        
        let tabInfo = await browser.tabs.get(key)
        listStr += `${key.toString()} ${tabInfo.title}<br />`
      }      
      tabsList.innerHTML = listStr
      break
    default:
      console.log('fail: ', m.msg)
  }
})




// function listen(p) {
//   if (p.name == "bg-to-panel") {
//     p.onMessage.addListener(function(m) {
//       console.log(m)
//     })
//   }
// }
// browser.runtime.onConnect(listen)