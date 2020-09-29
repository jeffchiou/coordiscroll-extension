let ports = []
let State = {
  tabId: new Map(),
  syncedTabs: new Set(),
  x: [],
  y: [],
  dx: [],
  dy: []
}
// let panelPort = browser.runtime.connect({name: "bg-to-panel"})

function connected(p) { 
  console.log(p.name)
  if (p.name == "panel-to-bg") {
    p.onMessage.addListener(function(m) {
      switch (m.f) {
        case "test":
          p.postMessage({f: m.f, msg: "test successful"})
          break
        case "getTabsInGroup":  
          p.postMessage({f: m.f, msg: State.tabId})
          break
        default:
          p.postMessage({f: m.f, msg: "didn't understand"})
      }
    })
    return
  }
  let currentTab = p.sender.tab.id
  ports[currentTab] = p

  ports[currentTab].onMessage.addListener(function(m) {
    if (!State.tabId.has(currentTab)) { 
      State.tabId.set(currentTab, State.tabId.size)
    }
    ind = State.tabId.get(currentTab)
    State.x[ind] = m.x
    State.y[ind] = m.y
    
    // console.log(State.y)
    // console.log(State.tabId)
    for (let key of State.tabId.keys()) {
      if (key != currentTab) {
        ports[key].postMessage({
          x: m.x,
          y: m.y
        })
      }
    }

  })

}

browser.runtime.onConnect.addListener(connected)


// browser.browserAction.onClicked.addListener(function() {
//   ports.forEach( p => {
//     p.postMessage({greeting: "they clicked the button!"})
//   })
  
// })
// function displayInfo() {

//   function onGot(tabInfo) {
//     console.log('Inside onGot() ...');
//     console.log(tabInfo);
//   }

//   function onError(error) {
//     console.log(`Error: ${error}`);
//   }

//   var gettingCurrent = browser.tabs.getCurrent();
//   gettingCurrent.then(onGot, onError);
// }

// browser.browserAction.onClicked.addListener(function(tab) {
//   console.log(tab)
//  })
