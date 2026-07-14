export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // 1. Basic HTML/XSS sanitization
  let sanitized = input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // 2. Prevent basic LLM Prompt Injections (Heuristics)
  const injectionPatterns = [
    /ignore all previous instructions/i,
    /ignore previous instructions/i,
    /forget all previous instructions/i,
    /disregard previous instructions/i,
    /system prompt/i,
    /you are now/i,
    /act as/i
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }

  return sanitized;
}
