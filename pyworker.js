importScripts('https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js');

async function loadPyodideAndPackages(){
    console.log("Pyodide LOADING")
    await loadPyodide({ indexURL : 'https://cdn.jsdelivr.net/pyodide/v0.17.0/full/' });
    await self.pyodide.loadPackage(['pandas']);
    console.log("Pyodide&Pandas  LOADED")
}

const loadPyodidePromise = loadPyodideAndPackages();

loadPyodidePromise.then(async (evt)=>{
    console.log('pyodide successfully loaded', evt)
    console.log('...environment warmup')
    await self.pyodide.runPythonAsync("import pandas as pd\nimport json\n")
    console.log('...environment warmup completed')
}).catch(err=>{
    console.log('not able to load pyodide', err)
})

self.onmessage = async(event) => {
    await loadPyodidePromise;
    const {code, ...context} = event.data;
    for (const key of Object.keys(context)){
        self[key] = context[key];
    }
    try {
        self.postMessage({
            results: await self.pyodide.runPythonAsync(code)
        });
    }
    catch (error){
        self.postMessage(
            {error : error.message}
        );
    }
}
