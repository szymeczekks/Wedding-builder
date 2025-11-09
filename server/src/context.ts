import jwt from 'jsonwebtoken';
import Auth from './modules/auth/auth.model';

export interface MyContext {
    user?: {
        id: string;
        email: string;
        role: string;
    }
}

interface MyToken {
    userId: string;
    email: string;
    role: string;
}

export const buildContext = async({ req }: { req: any }): Promise<MyContext> => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) return {};

    try {
        const decoded = jwt.verify(token, 'secret') as MyToken;
        const user = await Auth.findById(decoded.userId);
        if (!user) throw new Error('User not found.');
        return { user: { id: decoded.userId, email: decoded.email, role: decoded.role } };
    } catch (error) {
        return {};
    }
};