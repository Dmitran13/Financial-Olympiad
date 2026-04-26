import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Nickname",
      credentials: { nickname: { label: "Никнейм", type: "text" } },
      async authorize(credentials) {
        const nickname = credentials?.nickname?.trim();
        if (!nickname || nickname.length < 2) return null;

        let user = await prisma.user.findFirst({ where: { nickname } });
        if (!user) {
          user = await prisma.user.create({ data: { nickname } });
        }
        return { id: user.id, name: user.nickname };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
};
