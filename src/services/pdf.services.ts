import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars'; // 1. Importar handlebars
import QRCode from 'qrcode';
import { ReportData } from '../config/query.report';


export const createPdfSinHandelbars = async (data: any[]): Promise<Buffer> => {
  const templatePath = path.resolve(process.cwd(), 'templates', 'informe.lab.html');
  let html = await fs.readFile(templatePath, 'utf-8');

  const rows = data.map(item => `
    <tr>
        <td>${item.id}</td>
        <td>${item.nombre}</td>
        <td>${item.descripcion}</td>
    </tr>                    
  `).join('');

  html = html.replace('{{#each data}}...{{/each}}', rows);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necesario para Docker
  });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfUnit8Array = await page.pdf({ format: 'A4' });
  const pdfBuffer = Buffer.from(pdfUnit8Array);
  
  await browser.close();

  return pdfBuffer;
};


const ImageBase64 = async (path: string) => {
      const imagen = await fs.readFile(path);
      return Buffer.from(imagen).toString('base64');
}

const GenerarQRCode = async (info: string) => {

    const text = info || 'N/A';
    
    
    const qrOptions = {
      width: 70, 
      margin: 1,  
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    };

    const qrDataUrl = await QRCode.toDataURL(text, qrOptions);

    return qrDataUrl;
}


export const createPdf = async (templateData: ReportData): Promise<Buffer> => {
  const templatePath = path.resolve(process.cwd(), 'src/templates', 'informe.lab.html');

  const templateSource = await fs.readFile(templatePath, 'utf-8');

  let textInfo = `${templateData.Documento} - ${templateData.generationDate}`;
  console.log(textInfo);
  const qrUrl = await GenerarQRCode(textInfo);

  console.log(qrUrl);

  const logo = await ImageBase64('assets/img/icon_valmes.png');
  // const codigoQR = await ImageBase64(qrUrl);

  const template = handlebars.compile(templateSource);

  const dataTemplateUpdate = {
    ...templateData,
    logo: `data:image/png;base64,${logo}`,
    codigoQR: qrUrl
  }

  const html = template(dataTemplateUpdate);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setContent(html, { waitUntil: 'networkidle0' }); 
  
  const pdfUint8Array = await page.pdf({
    format: 'A4',
    printBackground: true, 
    margin: {
      top: '40px',
      right: '40px',
      bottom: '40px',
      left: '40px'
    }
  });
  const pdfBuffer = Buffer.from(pdfUint8Array);

  await browser.close();

  return pdfBuffer;
};