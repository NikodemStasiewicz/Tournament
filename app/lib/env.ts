/**
 * Environment variable validation utility
 * Ensures required environment variables are present at startup
 */

interface EnvConfig {
  JWT_SECRET: string;
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

function validateEnvironment(): EnvConfig {
  const requiredVars = ['JWT_SECRET', 'DATABASE_URL'] as const;

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new EnvValidationError(`Required environment variable ${varName} is not set`);
    }
  }

  // Validate JWT_SECRET strength
  const jwtSecret = process.env.JWT_SECRET!;
  if (jwtSecret.length < 32) {
    throw new EnvValidationError('JWT_SECRET must be at least 32 characters long');
  }

  return {
    JWT_SECRET: jwtSecret,
    DATABASE_URL: process.env.DATABASE_URL!,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development'
  };
}

// Validate environment on module load
export const env = validateEnvironment();

// Export individual variables for convenience
export const { JWT_SECRET, DATABASE_URL, NODE_ENV } = env;