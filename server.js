import express from "express";
import cors from 'cors';
import events from 'events';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emitter = new events.EventEmitter()
const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

app.get('/messages', (req, res ) => {
    
    emitter.once('newMessage', (message) => {
        res.json(message)
        res.end()
    })
})

app.post('/message', ((req, res) => {
    const message = req.body;
    emitter.emit('newMessage', message)
    res.status(200);
    res.end()
}))


const start = () => {
    try {
        app.listen(PORT, () => console.log('Server start in port: ' + PORT))
    } catch (error) {
        console.log(error)
    }
}


start()