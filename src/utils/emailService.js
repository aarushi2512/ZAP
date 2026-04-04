import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

/**
 * Send an email using EmailJS
 * @param {string} toEmail - Recipient's email address
 * @param {string} userName - Recipient's name
 * @param {object} additionalParams - Any additional template variables
 * @returns {Promise} - Resolves when email is sent
 */
export const sendEmail = async (toEmail, userName = 'User', additionalParams = {}) => {
  try {
    // Validate email
    if (!toEmail || typeof toEmail !== 'string' || !toEmail.includes('@')) {
      console.error('❌ Invalid email address:', toEmail);
      return { success: false, error: 'Invalid email address' };
    }

    const templateParams = {
      to_email: toEmail.trim(),
      user_name: userName || 'User',
      ...additionalParams
    };

    console.log('📧 Sending email to:', toEmail);
    console.log('📋 Template params:', templateParams);

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    console.error('Error details:', error.text || error);
    return { success: false, error };
  }
};