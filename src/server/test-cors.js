#!/usr/bin/env node

/**
 * Test CORS configuration for your production setup
 */

const axios = require("axios");

const BACKEND_URL = "https://full-stack-ecommerce-n5at.onrender.com";
const FRONTEND_ORIGIN = "https://ecommerce-nu-rosy.vercel.app";

async function testCORS() {
  console.log("🧪 Testing CORS Configuration...\n");

  // Test 0: Basic connectivity (try different endpoints)
  console.log("0. Testing basic connectivity...");

  const endpointsToTest = [
    "/health",
    "/api/health",
    "/api/v1/health",
    "/",
    "/api",
  ];

  let workingEndpoint = null;

  for (const endpoint of endpointsToTest) {
    try {
      console.log(`   Trying ${endpoint}...`);
      const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
        timeout: 5000,
      });
      console.log(`✅ Endpoint ${endpoint} works!`);
      console.log(`   Status: ${response.status}`);
      workingEndpoint = endpoint;
      break;
    } catch (error) {
      console.log(
        `   ❌ ${endpoint}: ${error.response?.status || error.message}`
      );
    }
  }

  if (!workingEndpoint) {
    console.error("❌ No endpoints are working. Server might be down.");
    return;
  }

  // Test 1: GraphQL preflight request
  console.log("\n1. Testing GraphQL preflight request...");
  try {
    const preflightResponse = await axios.options(
      `${BACKEND_URL}/api/v1/graphql`,
      {
        headers: {
          Origin: FRONTEND_ORIGIN,
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers":
            "Content-Type, Apollo-Require-Preflight",
        },
        timeout: 10000,
      }
    );

    console.log("✅ GraphQL preflight successful");
    console.log("   Status:", preflightResponse.status);
    console.log("   CORS Headers:", {
      "Access-Control-Allow-Origin":
        preflightResponse.headers["access-control-allow-origin"],
      "Access-Control-Allow-Methods":
        preflightResponse.headers["access-control-allow-methods"],
      "Access-Control-Allow-Headers":
        preflightResponse.headers["access-control-allow-headers"],
      "Access-Control-Allow-Credentials":
        preflightResponse.headers["access-control-allow-credentials"],
    });
  } catch (error) {
    console.error("❌ GraphQL preflight failed:");
    console.error("   Status:", error.response?.status);
    console.error("   Message:", error.message);
    console.error("   Response:", error.response?.data);
  }

  // Test 2: Regular API preflight request
  console.log("\n2. Testing regular API preflight request...");
  try {
    const apiPreflightResponse = await axios.options(
      `${BACKEND_URL}/api/auth/login`,
      {
        headers: {
          Origin: FRONTEND_ORIGIN,
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type, Authorization",
        },
        timeout: 10000,
      }
    );

    console.log("✅ API preflight successful");
    console.log("   Status:", apiPreflightResponse.status);
    console.log("   CORS Headers:", {
      "Access-Control-Allow-Origin":
        apiPreflightResponse.headers["access-control-allow-origin"],
      "Access-Control-Allow-Methods":
        apiPreflightResponse.headers["access-control-allow-methods"],
      "Access-Control-Allow-Headers":
        apiPreflightResponse.headers["access-control-allow-headers"],
      "Access-Control-Allow-Credentials":
        apiPreflightResponse.headers["access-control-allow-credentials"],
    });
  } catch (error) {
    console.error("❌ API preflight failed:");
    console.error("   Status:", error.response?.status);
    console.error("   Message:", error.message);
    console.error("   Response:", error.response?.data);
  }

  // Test 3: Test with working endpoint
  console.log("\n3. Testing CORS with working endpoint...");
  try {
    const corsResponse = await axios.get(`${BACKEND_URL}${workingEndpoint}`, {
      headers: {
        Origin: FRONTEND_ORIGIN,
      },
      timeout: 10000,
    });

    console.log("✅ CORS test successful");
    console.log("   Status:", corsResponse.status);
    console.log("   CORS Headers:", {
      "Access-Control-Allow-Origin":
        corsResponse.headers["access-control-allow-origin"],
      "Access-Control-Allow-Credentials":
        corsResponse.headers["access-control-allow-credentials"],
    });
  } catch (error) {
    console.error("❌ CORS test failed:");
    console.error("   Status:", error.response?.status);
    console.error("   Message:", error.message);
    console.error("   Response:", error.response?.data);
  }

  console.log("\n📋 Summary:");
  console.log(
    "- If basic connectivity fails, your server is down or unreachable"
  );
  console.log(
    "- If preflight requests fail with 500, there's a server error in CORS middleware"
  );
  console.log(
    "- If preflight requests fail with 403, CORS is blocking the origin"
  );
  console.log("- Check your server logs for detailed error messages");
}

testCORS().catch(console.error);
