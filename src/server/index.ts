import express from 'express';
import { createServer } from 'http';
const app = express();
const PORT = 8000;
const httpServer = createServer(app);
app.use(express.static(__dirname + '/../../build'));
// app.get('/', (/req, res) => res.send('hello'));
httpServer.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
