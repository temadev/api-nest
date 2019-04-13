import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ApolloError } from 'apollo-server-core';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { GraphQLContext } from '../app.module';
import { AuthGuard } from '../guards/auth.guard';
import { prisma, User } from '../prisma/generated/prisma-client';

@Resolver('User')
export class UserResolver {
  secret = process.env.JWT_SECRET;

  @Query()
  @UseGuards(AuthGuard)
  me(@Context() context: GraphQLContext) {
    return context.user;
  }

  @Query()
  async users(@Args() args): Promise<User[]> {
    const users = await prisma.users(args);
    return users;
  }

  @Mutation()
  async signup(@Args('input') input: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    try {
      const user = await prisma.createUser({
        email: input.email,
        password: hashedPassword,
      });
      const token = await jwt.sign(
        { id: user.id, email: user.email },
        this.secret,
        { expiresIn: '30 days' },
      );

      return { user, token };
    } catch {
      throw new ApolloError(`Email ${input.email} is already taken.`);
    }
  }

  @Mutation()
  async login(@Args('input') input: { email: string; password: string }) {
    const user = await prisma.user({ email: input.email });
    const isPasswordCorrect = await bcrypt.compare(
      input.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new ApolloError('Password is incorrect.');
    }

    const { id, email } = user;
    const token = await jwt.sign({ id, email }, this.secret, {
      expiresIn: '30 days',
    });

    return { user, token };
  }
}
