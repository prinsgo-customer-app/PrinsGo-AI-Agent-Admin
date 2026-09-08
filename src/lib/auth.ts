import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is missing');
    }
    return 'fallback_secret_for_development_only';
  }
  return secret;
};

export const signToken = (payload: unknown, expiresIn: string | number = '1d') => {
  return jwt.sign(payload as object, getJwtSecret(), { expiresIn: expiresIn as never });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (_error) {
    return null;
  }
};
