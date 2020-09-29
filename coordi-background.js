let ports = []
let State = {
  tabId: new Map(),
  syncedTabs: new Set(),
  x: [],
  y: [],
  x0: [],
  y0: []
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
    State.x0[ind] = State.x[ind]
    State.y0[ind] = State.y[ind]
    State.x[ind] = m.x
    State.y[ind] = m.y
    
    // console.log(State.y, State.y0)
    // console.log(State.tabId)
    for (let key of State.tabId.keys()) {
      if (key != currentTab) {
        ports[key].postMessage({
          x: m.x,
          y: m.y,
          x0: State.x0[ind],
          y0: State.y0[ind]
        })
        // Ignore state of follower windows to prevent scroll jumps
        // not sure if I should keep track of it or not though.
        followInd = State.tabId.get(key)
        State.x0[followInd] = undefined //= State.x[followInd]
        State.y0[followInd] = undefined //= State.y[followInd]
        State.x[followInd] = undefined //+= State.x[ind] - State.x0[ind]
        State.y[followInd] = undefined //+= State.y[ind] - State.y0[ind]
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
