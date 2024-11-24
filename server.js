import express from "express";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

let messages= [];
let clients = [];

app.post('/message', (req, res) => {
  const  message = req.body;
  messages.push(message);

  clients.forEach(client => client.res.json( message ));
  clients = [];

  res.status(200).send();
});

app.get('/messages', (req, res) => {
    const client = { res };
    clients.push(client);

  const timeoutId = setTimeout(() => {
    const index = clients.indexOf(client);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    if (!res.headersSent) { 
      res.json({  });
    }
  }, 30000);


  req.on('close', () => {
    clearTimeout(timeoutId);
    const index = clients.indexOf(client);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});


const start = () => {
    try {
        app.listen(PORT, () => console.log('Server start in port: ' + PORT))
    } catch (error) {
        console.log(error)
    }
}


start()