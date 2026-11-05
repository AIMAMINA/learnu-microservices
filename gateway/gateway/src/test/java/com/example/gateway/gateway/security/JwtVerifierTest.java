package com.example.gateway.gateway.security;

import org.junit.jupiter.api.Test;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class JwtVerifierTest {

    private static final String SECRET = "test-secret-that-is-at-least-32-characters";
    private final JwtVerifier verifier = new JwtVerifier(SECRET);

    private static String b64(String s) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }

    private static String token(String alg, String payload, String secret) throws Exception {
        String unsigned = b64("{\"alg\":\"" + alg + "\",\"typ\":\"JWT\"}") + "." + b64(payload);
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        String sig = Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(unsigned.getBytes(StandardCharsets.US_ASCII)));
        return unsigned + "." + sig;
    }

    private static String payload(String type, long exp) {
        return "{\"token_type\":\"" + type + "\",\"exp\":" + exp + ",\"user_id\":7,\"username\":\"amina\"}";
    }

    private static long inOneHour() {
        return Instant.now().getEpochSecond() + 3600;
    }

    @Test
    void acceptsValidAccessToken() throws Exception {
        var claims = verifier.verify(token("HS256", payload("access", inOneHour()), SECRET));
        assertTrue(claims.isPresent());
        assertEquals("7", claims.get().userId());
        assertEquals("amina", claims.get().username());
    }

    @Test
    void rejectsExpiredToken() throws Exception {
        long past = Instant.now().getEpochSecond() - 10;
        assertTrue(verifier.verify(token("HS256", payload("access", past), SECRET)).isEmpty());
    }

    @Test
    void rejectsRefreshToken() throws Exception {
        assertTrue(verifier.verify(token("HS256", payload("refresh", inOneHour()), SECRET)).isEmpty());
    }

    @Test
    void rejectsWrongSignature() throws Exception {
        String forged = token("HS256", payload("access", inOneHour()), "another-secret-of-at-least-32-characters");
        assertTrue(verifier.verify(forged).isEmpty());
    }

    @Test
    void rejectsAlgNoneAndGarbage() {
        String unsigned = b64("{\"alg\":\"none\"}") + "." + b64(payload("access", inOneHour())) + ".";
        assertTrue(verifier.verify(unsigned).isEmpty());
        assertTrue(verifier.verify("not-a-token").isEmpty());
        assertTrue(verifier.verify(null).isEmpty());
    }

    @Test
    void refusesShortSecret() {
        assertThrows(IllegalArgumentException.class, () -> new JwtVerifier("too-short"));
    }
}
