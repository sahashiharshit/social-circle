import redis from "../redis";
export async function verifySession(sessionId:string) {
    return await redis.get(`session:${sessionId}`)
}