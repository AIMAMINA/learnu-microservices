package com.example.gateway.gateway.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Single entry point security:
 *  1. every request except login/register needs a valid access token;
 *  2. the caller's identity is forwarded to the services in X-User-Id / X-User-Name;
 *  3. every successful write (POST/PUT/PATCH/DELETE) is recorded in the activity service.
 *
 * The services themselves are not exposed outside the Docker network,
 * so the gateway is the only way in.
 */
@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    public static final String USER_ID_HEADER = "X-User-Id";
    public static final String USER_NAME_HEADER = "X-User-Name";

    /** Paths reachable without a token. */
    private static final List<String> PUBLIC_PATHS = List.of(
            "/auth/login/",
            "/auth/register/",
            "/actuator/health"
    );

    /** Only the gateway writes activity logs. */
    private static final String ACTIVITY_WRITE_PATH = "/activity/add";

    private static final Set<HttpMethod> WRITE_METHODS =
            Set.of(HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH, HttpMethod.DELETE);

    private final JwtVerifier verifier;
    private final WebClient activityClient;

    public JwtAuthFilter(@Value("${jwt.secret}") String secret,
                         @Value("${services.activity-url}") String activityUrl,
                         WebClient.Builder webClientBuilder) {
        this.verifier = new JwtVerifier(secret);
        this.activityClient = webClientBuilder.baseUrl(activityUrl).build();
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();

        if (HttpMethod.OPTIONS.equals(request.getMethod())) {
            return chain.filter(exchange); // CORS preflight
        }
        if (path.startsWith(ACTIVITY_WRITE_PATH)) {
            return reject(exchange, HttpStatus.FORBIDDEN, "Activity logs are written by the gateway only.");
        }

        // Never trust identity headers sent by the browser
        ServerHttpRequest.Builder cleaned = request.mutate().headers(h -> {
            h.remove(USER_ID_HEADER);
            h.remove(USER_NAME_HEADER);
        });

        if (isPublic(path)) {
            return chain.filter(exchange.mutate().request(cleaned.build()).build());
        }

        Optional<JwtVerifier.UserClaims> user = verifier.verify(bearerToken(request));
        if (user.isEmpty()) {
            return reject(exchange, HttpStatus.UNAUTHORIZED, "Missing or invalid access token.");
        }

        JwtVerifier.UserClaims claims = user.get();
        ServerHttpRequest authenticated = cleaned
                .header(USER_ID_HEADER, claims.userId())
                .header(USER_NAME_HEADER, claims.username())
                .build();
        ServerWebExchange next = exchange.mutate().request(authenticated).build();

        return chain.filter(next).then(Mono.fromRunnable(() -> recordActivity(next, claims)));
    }

    private static boolean isPublic(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private static String bearerToken(ServerHttpRequest request) {
        String header = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) return null;
        return header.substring(7).trim();
    }

    private void recordActivity(ServerWebExchange exchange, JwtVerifier.UserClaims user) {
        ServerHttpRequest request = exchange.getRequest();
        HttpStatusCode status = exchange.getResponse().getStatusCode();
        if (!WRITE_METHODS.contains(request.getMethod()) || status == null || !status.is2xxSuccessful()) {
            return;
        }

        Route route = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
        Map<String, String> log = Map.of(
                "username", user.username().isBlank() ? "user " + user.userId() : user.username(),
                "action", actionFor(request.getMethod()),
                "microservice", route != null ? route.getId() : "gateway",
                "details", request.getMethod().name() + " " + request.getPath().value()
        );

        // Fire and forget: logging must never slow down or break the user's request
        activityClient.post()
                .uri(ACTIVITY_WRITE_PATH)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(log)
                .retrieve()
                .toBodilessEntity()
                .timeout(Duration.ofSeconds(3))
                .onErrorResume(e -> Mono.empty())
                .subscribe();
    }

    private static String actionFor(HttpMethod method) {
        if (HttpMethod.POST.equals(method)) return "CREATE";
        if (HttpMethod.DELETE.equals(method)) return "DELETE";
        return "UPDATE";
    }

    private static Mono<Void> reject(ServerWebExchange exchange, HttpStatus status, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] body = ("{\"error\":\"" + message + "\"}").getBytes(StandardCharsets.UTF_8);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body)));
    }
}
