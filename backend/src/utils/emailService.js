import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); // Ajusta el path según la ubicación real

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Envía un correo notificando bajo stock de un item
 * @param {string} destinatario - Email del destinatario
 * @param {string} nombreItem - Nombre del item
 */
export async function enviarAlertaBajoStock(destinatario, nombreItem, stockActual, stockMinimo) {
    const asunto = `Item ${nombreItem} bajo en stock`;
    const texto = `El item ${nombreItem} se encuentra en bajo stock. El stock mínimo es ${stockMinimo} y el stock actual es ${stockActual}. Le recomendamos reabastecerlo lo antes posible.`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: asunto,
        text: texto
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error al enviar correo de bajo stock:', error);
        return false;
    }
}