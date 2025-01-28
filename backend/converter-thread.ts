const worker = require("worker_threads");
const docxconverter = require('docx-pdf');
const parentPort = worker.parentPort;
const workerData = worker.workerData;

const path = require("path");
const fs = require("file-system");

const {inputPath,outputPath} = workerData;
docxconverter(inputPath, outputPath,(err,result)=>{
    if(err){
        parentPort.postMessage({error:`Error during conversion ${err.message}`});
    }else{
        parentPort.postMessage({success:true, result});
    }
});
