package com.example.gateway.gateway.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Clock;
import java.util.Base64;
import java.util.Optional;

/**
 * Verifies the HS256 access tokens issued by the auth service (djangorestframework-simplejwt).
 * Both services share the same secret through the JWT_SECRET environment variable.
 */
public class JwtVerifier {

    /** What the gateway needs to know about the caller. */
    public record UserClaims(String userId, String username) {}

    private static final Base64.Decoder B64 = Base64.getUrlDecoder();

    private final byte[] secret;
    private final ObjectMapper mapper = new ObjectMapper();
    private final Clock clock;

    public JwtVerifier(String secret) {
        this(secret, Clock.systemUTC());
    }

    public JwtVerifier(String secret, Clock clock) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("JWT_SECRET must be at least 32 characters long");
        }
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.clock = clock;
    }

    /** Returns the caller's claims if the token is a valid, unexpired access token. */
    public Optional<UserClaims> verify(String token) {
        if (token == null) return Optional.empty();
        String[] parts = token.split("\\.");
        if (parts.length != 3) return Optional.empty();

        try {
            JsonNode header = mapper.readTree(B64.decode(parts[0]));
            if (!"HS256".equals(header.path("alg").asText())) return Optional.empty();

            byte[] expected = sign(parts[0] + "." + parts[1]);
            byte[] actual = B64.decode(parts[2]);
            if (!MessageDigest.isEqual(expected, actual)) return Optional.empty();

            JsonNode payload = mapper.readTree(B64.decode(parts[1]));
            long exp = payload.path("exp").asLong(0);
            if (exp <= clock.instant().getEpochSecond()) return Optional.empty();
            if (!"access".equals(payload.path("token_type").asText())) return Optional.empty();

            String userId = payload.path("user_id").asText("");
            String username = payload.path("username").asText("");
            return Optional.of(new UserClaims(userId, username));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private byte[] sign(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return mac.doFinal(data.getBytes(StandardCharsets.US_ASCII));
    }
}
