import emailController from '../controllers/emailController.mjs';
import nodemailer from 'nodemailer';
import { jest } from '@jest/globals';

jest.mock('nodemailer');

describe('emailController.sendEmail', () => {
  let mockReq, mockRes, mockSendMail;

  beforeEach(() => {
    // Mock request object
    mockReq = {
      body: {
        senderEmail: 'tenant@example.com',
        senderName: 'John Tenant',
        recipientEmail: 'landlord@example.com',
        subject: 'Test Subject',
        message: 'Test Message'
      }
    };

    // Mock response object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Mock nodemailer transport
    mockSendMail = jest.fn().mockResolvedValue('Email sent');
    nodemailer.createTransport = jest.fn().mockReturnValue({ sendMail: mockSendMail });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should send email successfully', async () => {
    await emailController.sendEmail(mockReq, mockRes);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    expect(mockSendMail).toHaveBeenCalledWith({
      from: `"${mockReq.body.senderName}" <${mockReq.body.senderEmail}>`,
      to: mockReq.body.recipientEmail,
      subject: mockReq.body.subject,
      text: `Message from ${mockReq.body.senderName} (${mockReq.body.recipientEmail}):\n\n${mockReq.body.message}`
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith('Email sent successfully');
  });

  test('should handle email sending errors', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('SMTP failed'));

    await emailController.sendEmail(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith('Email sent successfully'); // (your controller message)
  });
});
