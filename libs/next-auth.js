import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Resend } from "resend";
import config from "@/config";
import connectMongo from "./mongo";
import connectMongoose from "./mongoose";
import User from "@/models/User";

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  // Turkish language configuration
  pages: {
    signIn: "/api/auth/signin",
    signOut: "/api/auth/signout",
    error: "/api/auth/error",
    verifyRequest: "/api/auth/verify-request",
    newUser: "/dashboard",
  },
  // Turkish language settings
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Sets the language of the consent screen.
          // Use 'tr' for Turkish, 'en' for English, etc.
          hl: "tr",
        },
      },
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
              headers: {
                "x-request-language": "tr",
              },
            },
            from: process.env.EMAIL_FROM || "noreply@resend.piyasai.com",
            sendVerificationRequest: async ({ identifier, url }) => {
              const resend = new Resend(process.env.RESEND_API_KEY);
              await resend.emails.send({
                from: process.env.EMAIL_FROM || "noreply@resend.piyasai.com",
                to: identifier,
                subject: "Piyasai.com Giriş Yapın",
                text: `Merhaba, giriş yapmak için aşağıdaki bağlantıya tıklayın: ${url}`,
                html: `
                  <!DOCTYPE html>
                  <html lang="tr">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Piyasai.com Giriş</title>
                  </head>
                  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
                      <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">
                          Piyasai.com Hoş Geldiniz
                        </h1>
                        <p style="color: #6b7280; font-size: 16px; line-height: 1.5; margin: 0;">
                          Merhaba, giriş yapmak için aşağıdaki butona tıklayın.
                        </p>
                      </div>
                      <div style="text-align: center; margin: 40px 0;">
                        <a href="${url}" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                          Giriş Yap
                        </a>
                      </div>
                      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                          Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
                        </p>
                      </div>
                    </div>
                  </body>
                  </html>
                `,
                headers: {
                  "Accept-Language": "tr-TR",
                },
              });
            },
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
      // On first sign-in, add isAdmin and xVerified from user object
      if (user) {
        token.isAdmin = user.isAdmin || false;
        token.xVerified = user.xVerified || false;
      }

      // On subsequent calls, query the database for current isAdmin and xVerified status
      if (token.sub) {
        try {
          await connectMongoose();
          const dbUser = await User.findById(token.sub);
          if (dbUser) {
            token.isAdmin = dbUser.isAdmin || false;
            token.xVerified = dbUser.xVerified || false;
          }
        } catch (error) {
          console.error("❌ Error fetching user status:", error);
          // Fallback to false if there's an error
          token.isAdmin = false;
          token.xVerified = false;
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.isAdmin = token.isAdmin || false;
        session.user.xVerified = token.xVerified || false;
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
    // Turkish language theme settings
    colorScheme: "dark",
    buttonText: "Giriş Yap",
  },
};
