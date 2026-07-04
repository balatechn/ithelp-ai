export { handlers as GET, handlers as POST } from "@/lib/auth";

// Re-export the handlers from the auth config
import { handlers } from "@/lib/auth";
export { handlers };
