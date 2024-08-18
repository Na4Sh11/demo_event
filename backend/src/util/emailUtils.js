// utils/emailUtils.js

const nodemailer = require('nodemailer');

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lucizodi@gmail.com', // Replace with your email
    pass: 'RandomPassword@2134'   // Replace with your email password
  }
});

/**
 * Send a purchase confirmation email to the user.
 * @param {string} to - Recipient's email address.
 * @param {Object} purchaseDetails - Details of the purchase.
 */
async function sendPurchaseConfirmationEmail(to, purchaseDetails) {
  const { eventName, location, localDate, localTime, numberOfTickets, totalPrice } = purchaseDetails;

  const mailOptions = {
    from: 'lucizodi@gmail.com',
    to: 'praveen1990179@gmail.com',
    subject: 'Ticket Purchase Confirmation',
    text: `
      Dear User,

      Thank you for your purchase!

      Event: ${eventName}
      Location: ${location}
      Date: ${localDate.toLocaleDateString()}
      Time: ${localTime}

      Number of Tickets: ${numberOfTickets}
      Total Price: $${totalPrice}

      We hope you enjoy the event!

      Best Regards,
      Event Management Team
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Purchase confirmation email sent successfully.');
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    throw new Error('Failed to send purchase confirmation email');
  }
}

module.exports = { sendPurchaseConfirmationEmail };
