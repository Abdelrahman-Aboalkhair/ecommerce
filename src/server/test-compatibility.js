#!/usr/bin/env node

/**
 * Test script for browser/device compatibility features
 * Run this after starting your server to verify all features work correctly
 */

const axios = require("axios");

const BASE_URL = process.env.TEST_URL || "http://localhost:5000";

// Test configurations
const testConfigs = [
  {
    name: "Desktop Chrome",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "X-API-Version": "v1",
    },
  },
  {
    name: "Mobile iOS Safari",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
      "X-API-Version": "v1",
    },
  },
  {
    name: "Mobile Android Chrome",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
      "X-API-Version": "v1",
    },
  },
  {
    name: "Tablet iPad",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
      "X-API-Version": "v1",
    },
  },
];

async function testHealthEndpoints() {
  console.log("\n🏥 Testing Health Endpoints...");

  try {
    // Test basic health
    const basicHealth = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Basic health check:", basicHealth.data.status);

    // Test detailed health
    const detailedHealth = await axios.get(`${BASE_URL}/health/detailed`);
    console.log("✅ Detailed health check:", detailedHealth.data.status);
    console.log("   Dependencies:", detailedHealth.data.dependencies);

    // Test readiness probe
    const readiness = await axios.get(`${BASE_URL}/ready`);
    console.log("✅ Readiness probe:", readiness.data.status);

    // Test liveness probe
    const liveness = await axios.get(`${BASE_URL}/live`);
    console.log("✅ Liveness probe:", liveness.data.status);
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
  }
}

async function testCORS() {
  console.log("\n🌐 Testing CORS...");

  try {
    // Test preflight request
    const preflight = await axios.options(`${BASE_URL}/api/v1/users`, {
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type, Authorization",
      },
    });

    console.log("✅ Preflight request successful");
    console.log("   CORS Headers:", {
      "Access-Control-Allow-Origin":
        preflight.headers["access-control-allow-origin"],
      "Access-Control-Allow-Methods":
        preflight.headers["access-control-allow-methods"],
      "Access-Control-Allow-Headers":
        preflight.headers["access-control-allow-headers"],
    });
  } catch (error) {
    console.error("❌ CORS test failed:", error.message);
  }
}

async function testDeviceDetection() {
  console.log("\n📱 Testing Device Detection...");

  for (const config of testConfigs) {
    try {
      const response = await axios.get(`${BASE_URL}/health`, {
        headers: config.headers,
      });

      console.log(`✅ ${config.name}:`);
      console.log(`   Device Type: ${response.headers["x-device-type"]}`);
      console.log(`   Platform: ${response.headers["x-platform"]}`);
      console.log(`   Browser: ${response.headers["x-browser"]}`);
      console.log(
        `   Browser Version: ${response.headers["x-browser-version"]}`
      );
    } catch (error) {
      console.error(`❌ ${config.name} test failed:`, error.message);
    }
  }
}

async function testAPIVersioning() {
  console.log("\n🔢 Testing API Versioning...");

  const versionTests = [
    { method: "URL", path: "/api/v1/health", expected: "v1" },
    { method: "URL", path: "/api/v2/health", expected: "v2" },
    {
      method: "Header",
      path: "/api/health",
      headers: { "X-API-Version": "v2" },
      expected: "v2",
    },
    { method: "Query", path: "/api/health?version=v2", expected: "v2" },
  ];

  for (const test of versionTests) {
    try {
      const response = await axios.get(`${BASE_URL}${test.path}`, {
        headers: test.headers || {},
      });

      const actualVersion = response.headers["x-api-version"];
      const status = actualVersion === test.expected ? "✅" : "❌";

      console.log(
        `${status} ${test.method} versioning: expected ${test.expected}, got ${actualVersion}`
      );
    } catch (error) {
      console.error(`❌ ${test.method} versioning test failed:`, error.message);
    }
  }
}

async function testSecurityHeaders() {
  console.log("\n🛡️ Testing Security Headers...");

  try {
    const response = await axios.get(`${BASE_URL}/health`);

    const securityHeaders = [
      "x-frame-options",
      "x-content-type-options",
      "x-xss-protection",
      "strict-transport-security",
      "content-security-policy",
      "referrer-policy",
    ];

    console.log("Security headers found:");
    securityHeaders.forEach((header) => {
      const value = response.headers[header];
      if (value) {
        console.log(`   ✅ ${header}: ${value}`);
      } else {
        console.log(`   ❌ ${header}: missing`);
      }
    });
  } catch (error) {
    console.error("❌ Security headers test failed:", error.message);
  }
}

async function testRateLimiting() {
  console.log("\n⏱️ Testing Rate Limiting...");

  try {
    // Make multiple requests to trigger rate limiting
    const promises = Array.from({ length: 5 }, () =>
      axios.get(`${BASE_URL}/health`)
    );

    const responses = await Promise.all(promises);

    // Check for rate limit headers
    const lastResponse = responses[responses.length - 1];
    const rateLimitHeaders = {
      "X-RateLimit-Limit": lastResponse.headers["x-ratelimit-limit"],
      "X-RateLimit-Remaining": lastResponse.headers["x-ratelimit-remaining"],
      "X-RateLimit-Reset": lastResponse.headers["x-ratelimit-reset"],
    };

    console.log("✅ Rate limiting headers:", rateLimitHeaders);
  } catch (error) {
    console.error("❌ Rate limiting test failed:", error.message);
  }
}

async function runAllTests() {
  console.log("🚀 Starting Browser/Device Compatibility Tests...");
  console.log(`📍 Testing against: ${BASE_URL}`);

  await testHealthEndpoints();
  await testCORS();
  await testDeviceDetection();
  await testAPIVersioning();
  await testSecurityHeaders();
  await testRateLimiting();

  console.log("\n✨ All tests completed!");
  console.log("\n📋 Summary:");
  console.log("- Health endpoints: Basic monitoring and Kubernetes probes");
  console.log("- CORS: Cross-origin request support");
  console.log("- Device detection: Automatic device/platform detection");
  console.log("- API versioning: Flexible versioning support");
  console.log("- Security headers: Comprehensive security protection");
  console.log("- Rate limiting: Abuse prevention");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testHealthEndpoints,
  testCORS,
  testDeviceDetection,
  testAPIVersioning,
  testSecurityHeaders,
  testRateLimiting,
  runAllTests,
};
