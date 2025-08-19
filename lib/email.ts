import nodemailer from 'nodemailer';

interface EmailConfig {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Créer le transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendAccessKey = async (email: string, accessKey: string, courseName: string) => {
  const emailConfig: EmailConfig = {
    to: email,
    subject: `Clé d'accès pour le cours : ${courseName}`,
    text: `
      Bonjour,
      
      Voici votre clé d'accès pour le cours "${courseName}" :
      ${accessKey}
      
      Pour accéder à votre cours, rendez-vous sur notre plateforme et entrez cette clé.
      
      Merci de votre confiance !
    `,
    html: `
      <h2>Bienvenue sur notre plateforme de formation !</h2>
      <p>Voici votre clé d'accès pour le cours "<strong>${courseName}</strong>" :</p>
      <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; font-size: 18px; text-align: center;">
        <code>${accessKey}</code>
      </div>
      <p>Pour accéder à votre cours :</p>
      <ol>
        <li>Connectez-vous à votre compte</li>
        <li>Cliquez sur "Activer un cours"</li>
        <li>Entrez votre clé d'accès</li>
      </ol>
      <p>Nous vous souhaitons une excellente formation !</p>
    `,
  };

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      ...emailConfig,
    });
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};
