package com.signal.support;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mail-test")
public class MailTestController {

    private final JavaMailSender mailSender;

    @GetMapping
    public String send(@RequestParam String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Signal Mail Test");
        message.setText("이메일 전송 테스트 성공!");
        mailSender.send(message);
        return "메일 전송 완료 → " + to;
    }
}
