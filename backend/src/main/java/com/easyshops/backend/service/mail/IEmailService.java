package com.easyshops.backend.service.mail;

import jakarta.mail.MessagingException;

public interface IEmailService {
  void sendOrderConfirmationEmail(String to, String subject, String body) throws
          MessagingException;
}
