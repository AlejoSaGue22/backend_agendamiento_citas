import { Request, Response } from 'express';
import pool from '../config/database';

export interface ReportData {
          reportTitle: string,
          Nombre: string,
          Documento: string,
          Edad: string,
          Direccion: string,
          Sexo: string,
          FechaNacimiento: string,
          generationDate: string,
          razonSocial: string,
          fechaAtencion: string,
          items: examen[],
}

export interface Informe {
        nombre_uno: string,
        nombre_dos: string,
        apellido_uno: string,
        apellido_dos: string,
        numero_doc: string,
        f_nacimiento: Date,
        sexo: string,
        edad: string,
        razon_social: string
        direccion: string,
        fecha_atencion: string,
        resultado: examen[],
}

export interface examen {
        nombre_examen: string,
        referencia: string,
        fecha: string,
        analisis: analisisQuimica[],
}

export interface analisisQuimica {
    nombreAnalisis: string,
    tecnica: string,
    unidades: string,
    intervalo: string,
    resultado: string,
}

export interface ResponseQuery {
    message: string
    data: Informe[]
}

export const queryinformesLab = async (solicitud: string): Promise<Informe> => {
    try {
        const  {rows} = await pool.query(`WITH examenes_con_analisis AS (

                                        SELECT
                                            al.solicitud_id,
                                            ae.nombre AS nombre_examen,
                                            ae.referencia,

                                            JSON_AGG(
                                                JSON_BUILD_OBJECT(
                                                    'nombreAnalisis', aa.nombre,
                                                    'tecnica', ae.tecnica,
                                                    'unidades', aa.unidades,
                                                    'intervalo', aa.intervalo,
                                                    'resultado', alq.resultado
                                                ) ORDER BY aa.nombre 
                                            ) AS analisis
                                        FROM 
                                            api_laboratorio al
                                        INNER JOIN api_laboratorioquimica alq ON alq.laboratorio_id = al.id
                                        INNER JOIN api_analisisquimico aa ON aa.id = alq.analisis_id
                                        INNER JOIN api_examencategoria ae ON ae.id = aa.categoria_id
                                        WHERE 
                                            al.solicitud_id = $1
                                        GROUP BY
                                            al.solicitud_id,
                                            ae.id,
                                            ae.nombre,
                                            ae.referencia
                                    )
                                    
                                    SELECT
                                        JSON_BUILD_OBJECT(
                                            'nombre_uno', cp.nombre_uno,
                                            'nombre_dos', cp.nombre_dos,
                                            'apellido_uno', cp.apellido_uno,
                                            'apellido_dos', cp.apellido_dos,
                                            'numero_doc', cp.numero_doc,
                                            'f_nacimiento', cp.f_nacimiento,
                                            'sexo', cp.sexo,
                                            'edad', cp.edad,
                                            'razon_social', ce.razon_social,
                                            'direccion', cp.direccion,
                                            'fecha_atencion', cs.fecha_atencion,
                                            'resultado', (
                                                SELECT 
                                                    COALESCE(JSON_AGG(
                                                        JSON_BUILD_OBJECT(
                                                            'nombre_examen', eca.nombre_examen,
                                                            'referencia', eca.referencia,
                                                            'analisis', eca.analisis
                                                        )
                                                    ), '[]'::json)
                                                FROM 
                                                    examenes_con_analisis eca
                                                WHERE 
                                                    eca.solicitud_id = cs.id
                                            )
                                        ) AS reporte_final
                                    FROM 
                                        client_solicitud cs
                                    INNER JOIN 
                                        client_paciente cp ON cp.id = cs.paciente_id
                                    INNER JOIN 
                                        client_empresa ce ON ce.id = cs.empresa_id
                                    WHERE 
                                        cs.id = $1`, [solicitud]);

            return rows[0].reporte_final;

    } catch (error) {
      throw error;
    }
}