import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';

import { UserModule } from './user/user.module';

import { getCurrentUser } from './utils/getCurrentUser.util';
import { User } from './prisma/generated/prisma-client';

export interface GraphQLContext {
  req: any;
  user: User;
}

@Module({
  imports: [
    UserModule,
    GraphQLModule.forRoot({
      typePaths: [path.join(__dirname, './**/*.graphql')],
      context: async ({ req }: any): Promise<GraphQLContext> => {
        return {
          req,
          user: await getCurrentUser(req),
        };
      },
    }),
  ],
})
export class AppModule {}
