window.addEventListener("load", () => main() | workers());
const newCodeBlockTmpl= `
        <div style="margin-bottom:8px">
            <div>
                <button class="pyrun">RUN</button>
                <button class="pyrm">DELETE</button>
            </div>
            <textarea class="python-code" style="width:100%;height:24px onkeyup="this.style.height='24px'; this.style.height = this.scrollHeight + 12 + 'px';"></textarea>
            <div class="output" style="display:none;margin-top:8px;padding:5px;border-color:blue;border-width:1px;border-style:solid;"></div>
            <div class="error" style="display:none;margin-top:8px;margin-bottom:8px;padding:5px;border-color:red;border-width:1px;border-style:solid;"></div>
        </div>
`
let activeBlock = null;
const main = () => {
  const runPython = (codeBlock) =>{
    activeBlock = codeBlock
    window.pyWorker.postMessage({ code: codeBlock.children[1].value});
  }
  document.addEventListener("click", (evt)=>{
    if(evt.target.classList.contains("pyrun")){
      runPython(evt.target.parentNode.parentNode)
    }else if(evt.target.classList.contains("pyrm")){
      let forRm = evt.target.parentNode.parentNode
      forRm.parentNode.removeChild(forRm);
    }
  });
  document.addEventListener("keypress", (evt) => {
    if(!evt.target.classList.contains("python-code")) return;
    const isShiftEnterPressed = evt.keyCode == 13 && evt.shiftKey
    if (isShiftEnterPressed){
      evt.preventDefault();
      evt.target.parentNode.insertAdjacentHTML('afterend', newCodeBlockTmpl);
      runPython(evt.target.parentNode);
      evt.target.parentNode.nextElementSibling.children[1].focus()
    }
  });
};

const workers = () => {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("/sw.js")
    .then((reg) => console.log("Service worker is registered", reg))
    .catch((err) => console.log("Service worker just crashed", err));

  const pyWorker = window.pyWorker = new Worker("/pyworker.js");
  pyWorker.onmessage = (msg) => {
    if (msg.data.error) {
      activeBlock.children[2].innerHTML = ""
      activeBlock.children[2].style.display = "none"
      activeBlock.children[3].innerHTML = msg.data.error;
      activeBlock.children[3].style.display = "block"
    } else {
      activeBlock.children[2].innerHTML = msg.data.results;
      activeBlock.children[2].style.display = "block"
      activeBlock.children[3].innerHTML = "";
      activeBlock.children[3].style.display = "none"
    }
  };
  pyWorker.onerror = (err) =>
    console.log("recieved an error from the python worker", err);
};
