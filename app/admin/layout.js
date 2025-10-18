import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";

// This is a server-side component to ensure the user is logged in and has admin access.
// If not authenticated, redirects to login page.
// If authenticated but not admin, redirects to dashboard with access denied message.
// It's applied to all subpages of /admin in /app/admin/*** pages
export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session) {
    console.log("🔐 Admin access denied: User not authenticated");
    redirect(config.auth.loginUrl);
  }

  // Check if user has admin privileges
  if (!session.user?.isAdmin) {
    console.log("🚫 Admin access denied: User is not admin", {
      email: session.user?.email,
      isAdmin: session.user?.isAdmin,
    });
    // Redirect to dashboard with access denied message
    redirect("/dashboard?message=access_denied");
  }

  console.log("✅ Admin access granted:", {
    email: session.user?.email,
    isAdmin: session.user?.isAdmin,
  });

  return <>{children}</>;
}
