export { };

export type Roles = 'admin' | 'user';

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles; // ✨ Added roles to the JWT session claims
        }
    }
}