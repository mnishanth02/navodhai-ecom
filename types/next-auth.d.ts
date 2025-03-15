import type { users } from "@/drizzle/schema";
import type { AdapterUser as DefaultAdapterUser } from "@auth/core/adapters";
import type { DefaultSession } from "next-auth";
import type { User as DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role?: (typeof users.$inferSelect)["role"];
      isActive?: (typeof users.$inferSelect)["isActive"];
      emailVerified?: (typeof users.$inferSelect)["emailVerified"];
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    emailVerified: (typeof users.$inferSelect)["emailVerified"];
    role: (typeof users.$inferSelect)["role"];
    isActive: (typeof users.$inferSelect)["isActive"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    // idToken?: string;
    role?: (typeof users.$inferSelect)["role"];
    isActive?: (typeof users.$inferSelect)["isActive"];
  }
}

//

declare module "@auth/core/adapters" {
  export interface AdapterUser extends DefaultAdapterUser {
    emailVerified: (typeof users.$inferSelect)["emailVerified"];
    role: (typeof users.$inferSelect)["role"];
    isActive: (typeof users.$inferSelect)["isActive"];
  }
}
