import { checkIdentity } from "../../permissions/rules";

describe('projectRules', () => {
    it('throws error when no user and session', async () => {
        expect(() => checkIdentity({ user: { id: '', email: '', role: '' }, sessionId: '' })).toThrow('No identity found.');
    });

    it('return true when user id provided', async () => {
        expect(checkIdentity({ user: { id: '123', email: '', role: '' }, sessionId: '' })).toBe(true);
    });

    it('return true when session id provided', async () => {
        expect(checkIdentity({ user: { id: '', email: '', role: '' }, sessionId: 'test' })).toBe(true);
    });
});