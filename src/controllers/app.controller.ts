import { Request, Response } from 'express';
import pool from '../config/database';
import { createPdf } from '../services/pdf.services';
import { queryinformesLab } from '../config/query.report';
import fs from 'fs';
import path from 'path';

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM apilaboratorio');
    // const pdfBuffer = await createPdf(rows);

    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=informe.pdf');
    // res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generando el informe');
  }
};

const agregarArchivo = async (file: Buffer<ArrayBufferLike>, documento: string) => {
    try {
      const carpetaTemporal = path.resolve(process.cwd(), 'files');
        if (!fs.existsSync(carpetaTemporal)) {
            fs.mkdirSync(carpetaTemporal, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `informe-${timestamp}-${documento}.pdf`;
        const filePath = path.join(carpetaTemporal, fileName);
        fs.writeFileSync(filePath, file);
    
        return filePath;
    } catch (error) {
        return console.log({ message: 'Error agregando archivo a carpeta temporal', error: error });
    }
};


export const obtenerData = async (req: Request, res: Response) => {
    try {
      const { solicitud } = req.body;  

      if(!solicitud){
          res.json({ message: 'Debes ingresar el id de la solicitud' });
      }

      const resp = await queryinformesLab(solicitud);
      if (!resp) {
          res.json({ message: 'No se encontraron registros' });
          return;
      }

      const info = resp;
      const reportData = {
          reportTitle: 'Informe de Laboratorio',
          Nombre: `${info.nombre_uno} ${info.nombre_dos} ${info.apellido_uno} ${info.apellido_dos}`,  
          Documento: info.numero_doc,
          Edad: info.edad,
          Direccion: info.direccion,
          Sexo: info.sexo,
          FechaNacimiento: new Date(info.f_nacimiento).toLocaleDateString(),
          generationDate: new Date().toLocaleString(),
          razonSocial: info.razon_social,
          fechaAtencion: new Date(info.fecha_atencion).toLocaleString(),
          items: info.resultado
      };

      const pdfBuffer = await createPdf(reportData);
      await agregarArchivo(pdfBuffer, info.numero_doc);
      
      // res.json({ message: 'Obteniendo registros', data: resp, array: reportData.items });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=informe_inventario.pdf');
      res.send(pdfBuffer);

        // res.send("PDF generado exitosamnte");
    } catch (error) {
      console.error(error);
      res.status(404).json({ codigo: '1', message: 'Datos no encontrados'});
    }
}


export const generateReport2Nuevo = async (req: Request, res: Response) => {
    try {
      const { userId, productId } = req.body; 
      const dbResult = await pool.query('SELECT * FROM productos WHERE stock > 0');
    
      const reportData = {
        reportTitle: 'Informe de Inventario Actual',
        userName: 'Admin', 
        generationDate: new Date().toLocaleDateString('es-CO'),
        items: dbResult.rows 
      };

      const pdfBuffer = await createPdf(reportData as any);

      // 4. Envía el PDF al cliente
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=informe_inventario.pdf');
      res.send(pdfBuffer);
      
    } catch (error) {
        console.error('Error al generar el informe:', error);
        res.status(500).send('Error interno del servidor al generar el informe en PDF.');
    }
};