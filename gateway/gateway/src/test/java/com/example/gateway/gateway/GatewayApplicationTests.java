package com.example.gateway.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "jwt.secret=test-secret-that-is-at-least-32-characters")
class GatewayApplicationTests {

	@Test
	void contextLoads() {
	}

}
