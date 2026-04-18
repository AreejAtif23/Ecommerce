import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Ecommerce Store" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const html = `<h1>Email Verification</h1><p>Please click the link below to verify your email address:</p><a href="${verificationUrl}" target="_blank">Verify Email</a><p>This link expires in 24 hours.</p>`;
  await sendEmail({ email, subject: 'Verify Your Email', html });
};

export const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const html = `<h1>Reset Your Password</h1><p>Click the link below to reset your password:</p><a href="${resetUrl}" target="_blank">Reset Password</a><p>This link expires in 1 hour.</p>`;
  await sendEmail({ email, subject: 'Password Reset Request', html });
};

export const sendOrderConfirmationEmail = async (email, orderDetails) => {
  const html = `<h1>Order Confirmation</h1><p>Thank you for your order!</p><p><strong>Order Number:</strong> ${orderDetails._id}</p><p><strong>Total Amount:</strong> Rs. ${orderDetails.totalAmount}</p><p><strong>Shipping Address:</strong> ${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}</p><h3>Items:</h3><ul>${orderDetails.items.map(item => `<li>${item.productName} - ${item.quantity} x Rs. ${item.price}</li>`).join('')}</ul><p>Your order will be processed soon.</p>`;
  await sendEmail({ email, subject: 'Order Confirmation', html });
};