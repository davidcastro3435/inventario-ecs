import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
  secure:
    typeof process.env.EMAIL_SECURE !== "undefined"
      ? process.env.EMAIL_SECURE === "true"
      : true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // tu App Password (16 chars)
  },
});

// Opcional: verificar conexión al iniciar (útil para depuración)
transporter
  .verify()
  .then(() => console.log("SMTP conectado y listo"))
  .catch((err) => console.error("Error conectando SMTP:", err));

export async function enviarAlertaBajoStock(
  destinatario,
  nombreItem,
  stockActual,
  stockMinimo,
) {
  console.log("Enviando alerta de bajo stock...");
  const asunto = `Item ${nombreItem} bajo en stock`;
  const texto = `El item ${nombreItem} se encuentra en bajo stock. El stock mínimo es de ${stockMinimo} y el stock actual es ${stockActual}.`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    text: texto,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return false;
  }
}
