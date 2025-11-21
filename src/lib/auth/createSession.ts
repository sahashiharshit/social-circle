import redis from "../redis";

import { randomUUID } from "crypto";

export async function createSession(userId: string) {
    const sessionId = randomUUID()
    await redis.set(`session:${sessionId}`, userId, { EX: 60 * 60 * 24 * 7 })
    return sessionId
}