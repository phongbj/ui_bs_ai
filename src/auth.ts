import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  // callbacks: {
  //   async signIn({ user }) {
  //     return true;
  //   },
  //   async session({ session, user }) {
  //     return session;
  //   },
  // },
  events: {
    async createUser({ user }) {
      // Create a ServiceUser record for the new user
      if (user.id) {
        try {
          await prisma.serviceUser.upsert({
            where: {
              userId: user.id,
            },
            update: {},
            create: {
              userId: user.id,
              credits: {
                create: { balance: 0 },
              },
            },
          });
          console.log(`ServiceUser created for user ID: ${user.id}`);
        } catch (error) {
          console.error("Error creating ServiceUser:", error);
        }
      } else {
        console.error("Cannot create ServiceUser: user.id is undefined");
      }
    },
  },
});
