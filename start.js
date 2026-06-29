process.env.HOSTNAME = '0.0.0.0';

// Next.js standalone server reads the PORT environment variable automatically
// We just need to ensure it binds to all interfaces (0.0.0.0) instead of localhost
// so that the hosting provider's load balancer can route traffic to it.

import('./.next/standalone/server.js').catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
