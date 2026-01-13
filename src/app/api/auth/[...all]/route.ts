import { auth } from "@/lib/auth"; //import auth to server
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth); //Handles all end points like login signup sighout ETC