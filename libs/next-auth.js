import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import connectMongoose from "./mongoose";
import User from "@/models/User";

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(connectMongo
      ? [
          EmailProvider({
            server: {
              host: "smtp.resend.com",
              port: 587,
              auth: {
                user: "resend",
                pass: process.env.RESEND_API_KEY,
              },
            },
            from: process.env.EMAIL_FROM || "noreply@resend.piyasai.com",
          }),
        ]
      : []),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    jwt: async ({ token, user }) => {
      // On first sign-in, add isAdmin from user object
      if (user) {
        token.isAdmin = user.isAdmin || false;
      }

      // On subsequent calls, query the database for current isAdmin status
      if (token.sub) {
        try {
          await connectMongoose();
          const dbUser = await User.findById(token.sub);
          if (dbUser) {
            token.isAdmin = dbUser.isAdmin || false;
          }
        } catch (error) {
          console.error("❌ Error fetching user isAdmin status:", error);
          // Fallback to false if there's an error
          token.isAdmin = false;
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },
    signIn: async ({ user, account }) => {
      try {
        console.log("🔐 NextAuth signIn callback triggered:", {
          user: user?.email,
          account: account?.type,
          provider: account?.provider,
        });

        // Log Resend email authentication attempts
        if (account?.type === "email") {
          console.log("📧 Resend email authentication attempt:", {
            email: user?.email,
            provider: account?.provider,
          });
        }

        return true;
      } catch (error) {
        console.error("❌ NextAuth Resend hatası debug et:", error.message);
        console.error("Full error:", error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
};
