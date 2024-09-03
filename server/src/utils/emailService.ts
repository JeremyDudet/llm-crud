import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // Configure your email service here
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationLink = `http://yourapp.com/verify-email?token=${token}`;
  await transporter.sendMail({
    from: '"Your App" <noreply@yourapp.com>',
    to,
    subject: "Verify your email",
    html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetLink = `http://yourapp.com/reset-password?token=${token}`;
  await transporter.sendMail({
    from: '"Your App" <noreply@yourapp.com>',
    to,
    subject: "Reset your password",
    html: `Click <a href="${resetLink}">here</a> to reset your password.`,
  });
};
