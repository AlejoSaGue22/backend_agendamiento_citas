import express, { Application, Request, Response } from 'express';
import reportRoutes from './routes/report.routes';
import cors from 'cors';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/prueba', (req: Request, res: Response) => {
  res.send('API para generar informes en PDF');
});

app.use('/api/reports', reportRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});