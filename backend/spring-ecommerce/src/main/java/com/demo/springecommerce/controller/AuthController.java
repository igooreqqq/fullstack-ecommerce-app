package com.demo.springecommerce.controller;

import com.demo.springecommerce.dao.UserRepository;
import com.demo.springecommerce.dto.AuthenticationRequest;
import com.demo.springecommerce.dto.AuthenticationResponse;
import com.demo.springecommerce.dto.RegisterRequest;
import com.demo.springecommerce.entity.User;
import com.demo.springecommerce.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {

        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {

        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/user")
    public ResponseEntity<User> getLoggedInUser(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElse(null);

        return ResponseEntity.ok(user);
    }
}
