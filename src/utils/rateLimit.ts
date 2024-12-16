import rateLimit from 'express-rate-limit';


export const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per `windowMs`
  keyGenerator: (req) => {
    return req.ip; // Use the request's IP address as the key
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP. Please try again later.',
    });
  },
});
