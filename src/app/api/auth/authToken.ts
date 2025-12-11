import "dotenv/config";
import { jwtVerify, SignJWT } from "jose";

/** The maximum allowable time for the JWT to be valid */
export const EXPIRY = 3*24*60*60;

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Generates an authentication JWT for the specified `user` that expires after `EXPIRY` time.
 * @param user 
 */
export async function generateToken(user: string): Promise<string> {
    return new SignJWT({ user })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + EXPIRY)
        .sign(secret);
}

/**
 * Extracts the authenticated user from the JWT.
 * @param token 
 * @returns The username of the authenticated user, or an empty string for an invalid or expired JWT
 */
export async function getUserFromToken(token: string): Promise<string> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload.user as string ?? "";
    }
    catch (err) {
        return "";
    }
}

/**
 * Verifies that the given JWT is valid for `user`.
 * @param user 
 * @param token 
 */
export async function verifyToken(user: string, token: string): Promise<boolean> {
    try {
        const { payload } = await jwtVerify(token, secret);

        return payload.user == user;
    }
    catch (err) {
        return false;
    }
}