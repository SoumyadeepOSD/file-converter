const docxConverter = require('docx-pdf');
const express = require('express');
const fs = require("file-system");
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const {Worker}=require("worker_threads");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//* Configure multer to save files in the 'uploads/' directory
const upload = multer({ dest: 'uploads/' });

app.get('/', (req:any, res:any) => {
    res.json({ message: 'Hello World!' });
});

app.post('/convert', upload.single('file'), (req:any, res:any) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const inputPath = path.resolve(file.path);
        const outputPath = path.join('uploads', `${file.filename}.pdf`);

        // !Initialize worker thread, i/p & o/p path is passed to it 
        const worker = new Worker('./converter-thread.ts',{
            workerData: { inputPath, outputPath }
        });


        // ~"message" event will capture the emitted data from thread, i.e. err & result
        worker.on("message",(message:any)=>{
            if (message.error) {
                console.error(message.error);
                return res.status(500).json({ message: 'File conversion failed.' });
            }
            console.log('Conversion result:', message.result);
            res.download(outputPath, `${file.originalname.split('.')[0]}.pdf`, (err:any) => {
                if (err) {
                    console.error('Error sending the file:', err);
                }
            });
            setTimeout(()=>{
                //~The original file is deleted
                fs.unlink(inputPath, (unlinkErr:any)=>{
                    if(unlinkErr){
                        console.error(`Error deleting original file ${unlinkErr}`);
                    }else{
                        console.log(`File ${outputPath} deleted successfully`);
                    }
                });
                //~The pdf file is deleted
                fs.unlink(outputPath, (unlinkErr:any)=>{
                    if(unlinkErr){
                        console.error(`Error deleting pdf file ${unlinkErr}`);
                    }else{
                        console.log(`File ${outputPath} deleted successfully`);
                    }
                });
            },10000);
        });
        // ~If any error is there, show it
        worker.on('error', (error:any) => {
            console.error('Worker error:', error);
            res.status(500).json({ message: 'File conversion failed due to worker error.' });
        });

        // ~It's the last task
        worker.on('exit', (code:any) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });
    } catch (error:any) {
        console.error('Error converting file:', error);
        res.status(500).json({ message: 'File conversion failed.' });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
