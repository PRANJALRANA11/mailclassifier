// app/api/auth/[...nextauth]/route.ts
// Authenticated route for NextAuth
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler: any = NextAuth(authOptions);

export { handler as GET, handler as POST };
