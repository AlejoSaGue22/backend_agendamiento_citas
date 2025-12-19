import express, { Application, Request, Response } from 'express';
import Routes from './routes/index.routes';
import cors from 'cors';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/prueba', (req: Request, res: Response) => {
  res.send('API para realizar pruebas');
});

app.use('/api/v1', Routes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});