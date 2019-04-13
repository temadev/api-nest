import * as jwt from 'jsonwebtoken';

import { prisma, User } from '../prisma/generated/prisma-client';

const SECRET = process.env.JWT_SECRET;

interface UserData {
  id: string;
  email: string;
}

export const getCurrentUser = async (req: any): Promise<User | null> => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const decoded = (await jwt.verify(token, SECRET)) as UserData;

    return await prisma.user({ id: decoded.id });
  } catch {
    return null;
  }
};
