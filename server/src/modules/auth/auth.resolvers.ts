import { authService } from "./auth.service";

interface RegisterArgs {
    email: string;
    password: string;
    name: string
}

export const authResolvers = {
    Mutation: {
        register: async(_:unknown, args: RegisterArgs) => {
            return authService.register(args);
        }
    },
    Query: {
        login: async(_:unknown, args: { email: string; password: string }) => {
            return authService.login(args);
        }
    }
}