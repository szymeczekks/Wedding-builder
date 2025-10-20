import User from './auth.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import validator from 'validator';

interface LoginInput {
    email: string;
    password: string;
}

interface RegisterInput {
    email: string,
    password: string,
    name: string
}

interface AuthPayload {
    _id: string;
    email: string;
    name?: string;
    token: string;
}

interface ValidationError {
    field: string;
    message: string;
}

export const authService = {
    login: async({ email, password }: LoginInput): Promise<AuthPayload> => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApolloError('User not found', 'USER_NOT_FOUND');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new ApolloError('Invalid password.', 'INVALID_PASSWORD');
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            },
            'secret',
            {
                expiresIn: '1h'
            }
        )

        return {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            token: token
        }
    },

    register: async ({ email, name, password }: RegisterInput): Promise<AuthPayload> => {
        const errors: ValidationError[] = [];
        if (!validator.isEmail(email)) {
            errors.push({ field: "email", message: "Email is invalid" });
        }

        if (!validator.isLength(name, { min: 2 })) {
            errors.push({ field: "name", message: "Name is too short" });
        }

        if (!validator.isLength(password, { min: 8 }) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push({ field: "password", message: "Password has to be at least 8 characters long and contain at least one special character." });
        }

        if (errors.length > 0) {
            throw new ApolloError("Validation errors", "VALIDATION_FAILED", { errors });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApolloError('Email already in use', 'EMAIL_TAKEN');
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashed, name });

        return authService.login({ email, password });
    }
}