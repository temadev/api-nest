import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-core';
import * as jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    try {
      const token = ctx.req.headers.authorization.replace('Bearer ', '');
      await jwt.verify(token, SECRET);

      return true;
    } catch {
      throw new ApolloError('Authorization failed.');
    }
  }
}
