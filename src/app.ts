import express from 'express';
import connectDB from './db';
import bodyParser from 'body-parser';
import config from './config'; 
import { ipRateLimiter } from './utils/rateLimit';

import policyRoutes from './routes/policy';
import complianceRoutes from './routes/compliance';
import { ZodError } from 'zod';
import { AppError } from './utils/types/compliance';


(async () => {
  await connectDB();
})();


const app = express();

app.use(bodyParser.json());
app.use(ipRateLimiter);  // Rate limit requests from the same IP address


app.use('/api/policy', policyRoutes);
app.use('/api/compliance', complianceRoutes);

// Zod error handler middleware
app.use((err, req, res, next) => {
  if (err instanceof ZodError) {
    const issuesString = err.errors.map(issue => `${issue.path.join('.')} - ${issue.message}`).join(', ');
    return res.status(400).json({
      message: 'Validation Error',
      issues: issuesString, 
    });
  }
  if(err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }
  next(err);
});

app.listen(config.get('port'), () => {
  return console.log(`Express is listening at http://localhost:${config.get('port')}`);
});