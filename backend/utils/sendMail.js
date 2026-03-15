import nodeMailer from "nodemailer";
import "dotenv/config";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendMail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const { email, subject, template, data } = options;

    // get the path of the template
    const templatePath = path.join(__dirname, "../mails", template);

    // render the template with the data
    const html = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);

  } catch (err) {
    throw new Error(err.message);
  }
};

export default sendMail;
