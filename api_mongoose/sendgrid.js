const sgMail = require("@sendgrid/mail");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "smdeile@gmail.com",
  from: "smdeile@gmail.com",
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};
async function main() {
  const send = await sgMail.send(msg);
  console.log("send", send);
}
main();
