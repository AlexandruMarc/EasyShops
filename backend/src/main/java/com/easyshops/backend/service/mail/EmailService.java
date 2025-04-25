package com.easyshops.backend.service.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
public class EmailService implements IEmailService {
  @Autowired
  private JavaMailSender mailSender;

  @Override
  public void sendOrderConfirmationEmail(String to, String subject, String body) throws
          MessagingException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);

    helper.setFrom("marcalexander800@yahoo.com");
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(body, true); // 'true' indicates the content is HTML

    mailSender.send(message);
  }
}
