window.addEventListener("load", () => main() | workers());

const $ = (key) => {
  if (key[0] == "#") return document.getElementById(key.substring(1));
  if (key[0] == ".") return [...document.getElementsByClassName(key.substring(1))];
  throw "Not known selector";
};

const main = () => {
  const runPython = () =>
    window.pyWorker.postMessage({ code: $("#python-code").value });

  $(".pyrun").forEach((x) => x.onclick = runPython);

  $("#python-code").addEventListener("keypress", (evt) => {
    const shiftEnter = evt.keyCode == 13 && evt.shiftKey
    if (!shiftEnter) return
    evt.preventDefault();
    runPython();
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
      $("#output").innerHTML = "";
      $("#error").innerHTML = msg.data.error;
    } else {
      $("#output").innerHTML = msg.data.results;
      $("#error").innerHTML = "";
    }
  };
  pyWorker.onerror = (err) =>
    console.log("recieved an error from the python worker", err);
};
