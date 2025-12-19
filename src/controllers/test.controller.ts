import { Request, Response } from "express";
import { query } from "../config/db"


export const testApp = async (req: Request, res: Response) => {
    try {
        const queryTest = await query('SELECT NOW()');
        let resp = new Date(queryTest.rows[0].now).toLocaleString();
        console.log("Conexion Exitosa: ", resp);
        res.send(`Conexion Exitosa - Base de Datos, ${resp}`);

    } catch (error) {
        console.log("Conexion Fallida: Error al conectar con la BD");
        res.send('Conexion Fallida: Error al conectar con la BD');
    }

}