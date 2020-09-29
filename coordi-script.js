let myPort = browser.runtime.connect({name:"port-from-cs"})

myPort.postMessage({greeting: "Hello from content script"})
myPort.onMessage.addListener(function(m) {

  window.requestAnimationFrame(() => {    
    // console.log("In content script, received message from background script: ")
    // console.log(m.x, m.y)
    window.removeEventListener('scroll', scrollListener)
    window.scrollTo({top: m.y, left: m.x, behavior: 'auto'})
    
    window.requestAnimationFrame(() => {
      window.addEventListener('scroll', scrollListener)
    })
  })
})
function scrollListener(e) {
  window.requestAnimationFrame(() => {
    // console.log(window.scrollX, window.scrollY)
    myPort.postMessage({
      x: window.scrollX,
      y: window.scrollY
    })
  })
}
window.addEventListener('scroll', scrollListener)

// console.log("test", document.body.scrollTop)
// console.log("window", window.scrollY)
// chrome.tabs.getCurrent(tab => console.log(tab))
// console.log('test2')

// let children = main.childNodes;

// let div = document.createElement('div');
// div.className = "alert";
// div.innerHTML = "<strong>Hi there!</strong> You've read an important message.";

// document.body.append(div);



// for(var i=0; i<nodes.length; i++) {
//     if (nodes[i].nodeName.toLowerCase() == 'div') {
//          nodes[i].style.background = color;
//      }
// }
// const appendClone = (target, elToClone, id=null, _class=null) => {
//   let newEl = elToClone.cloneNode(true)
//   id ? newEl.id=id : newEl.removeAttribute('id')
//   newEl.classList.remove("hidden")
//   if (_class) newEl.classList.add(_class)
//   target.append(newEl)
// }
// appendClone