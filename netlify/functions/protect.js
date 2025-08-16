import arcjet, { shield, detectBot } from "@arcjet/node";

// Initialize ArcJet
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Block common attacks like XSS
    shield({ mode: "LIVE" }),
    // Detect bots
    detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
  ],
});

export const handler = async (event) => {
  // Run ArcJet on this request
  const result = await aj.run(event);

  // If ArcJet blocks it
  if (result.blocked) {
    return { statusCode: 403, body: "Access Denied: ArcJet blocked this request!" };
  }

  // Check for a "malicious" test query
  // Example: ?test=<script>alert(1)</script>
  if (event.queryStringParameters?.test) {
    return { statusCode: 403, body: "Blocked test attack!" };
  }

  // Normal requests
  return { statusCode: 200, body: "Hello! ArcJet is running." };
};
