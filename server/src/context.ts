import jwt from 'jsonwebtoken';
import Auth from './modules/auth/auth.model';
import { ApolloError } from 'apollo-server-errors';

export interface MyContext {
    user?: {
        id: string;
        email: string;
        role: string;
    },
    sessionId?: string
}

interface MyToken {
    userId: string;
    email: string;
    role: string;
}

export const buildContext = async({ req }: { req: any }): Promise<MyContext> => {
    const token = await verifyToken(req);
    const sessionId = getSessionId(req);

    return Object.assign(token, sessionId);
};

async function verifyToken(req: any) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) return {};

    try {
        const decoded = jwt.verify(token, 'secret') as MyToken;
        const user = await Auth.findById(decoded.userId);
        if (!user) return {};
        return { user: { id: decoded.userId, email: decoded.email, role: decoded.role } };
    } catch (error) {
        return {};
    }
}

function getSessionId(req: any) {
    const sessionId = req.headers['x-session-id'];
    return { sessionId: sessionId || null };
}