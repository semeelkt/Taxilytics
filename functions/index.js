/**
 * Firebase Cloud Function for Email Notifications
 * Send email to admin when new client submits details
 *
 * Admin Email: mohammedshameemkt570@gmail.com
 *
 * To deploy:
 * 1. cd functions
 * 2. npm install
 * 3. firebase functions:config:set admin.email="mohammedshameemkt570@gmail.com"
 * 4. firebase functions:config:set admin.email_password="YOUR_APP_PASSWORD"
 * 5. firebase deploy --only functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get config
const config = functions.config();

// Configure email transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.admin.email,
    pass: config.admin.email_password
  }
});

// Alternative: Use SendGrid
// const transporter = nodemailer.createTransport({
//   host: 'smtp.sendgrid.net',
//   port: 587,
//   auth: {
//     user: 'apikey',
//     pass: process.env.SENDGRID_API_KEY
//   }
// });

/**
 * Triggered when a new client submission is created
 * Sends email notification to admin
 */
exports.notifyAdminNewSubmission = functions.firestore
  .document('client_submissions/{docId}')
  .onCreate(async (snap, context) => {
    const submission = snap.data();
    const adminEmail = process.env.ADMIN_EMAIL;

    // Email content
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: adminEmail,
      subject: `🎯 New Client Submission - ${submission.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4361ee; margin-top: 0;">New Client Submission</h2>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${submission.phone}">${submission.phone}</a></p>

              ${submission.notes ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                  <p><strong>Notes:</strong></p>
                  <p style="color: #555; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #4361ee;">
                    ${submission.notes}
                  </p>
                </div>
              ` : ''}

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #999;">
                  Submitted on: ${new Date(submission.submittedAt.toDate()).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
              <p style="margin: 0;">
                <strong>📱 Quick Actions:</strong>
              </p>
              <p style="margin: 10px 0;">
                <a href="https://wa.me/${submission.phone.replace(/[^0-9]/g, '')}"
                   style="color: #25d366; text-decoration: none; font-weight: bold;">
                  💬 Chat on WhatsApp
                </a>
              </p>
              <p style="margin: 10px 0;">
                <a href="https://finregindia.vercel.app/pages/admin.html?token=YOUR_TOKEN_HERE"
                   style="color: #4361ee; text-decoration: none; font-weight: bold;">
                  📊 View in Admin Panel
                </a>
              </p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p>This is an automated notification from Finreg.</p>
            </div>
          </div>
        </div>
      `,
      text: `
New Client Submission

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}

${submission.notes ? `Notes:\n${submission.notes}` : ''}

Submitted on: ${new Date(submission.submittedAt.toDate()).toLocaleString('en-IN')}

View in Admin Panel: https://finregindia.vercel.app/pages/admin.html?token=YOUR_TOKEN_HERE
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${adminEmail} for submission from ${submission.name}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  });

/**
 * Optional: Delete email when submission is deleted
 */
exports.onSubmissionDelete = functions.firestore
  .document('client_submissions/{docId}')
  .onDelete(async (snap, context) => {
    const submission = snap.data();
    console.log(`Client submission from ${submission.name} was deleted`);
    return { deleted: true };
  });
