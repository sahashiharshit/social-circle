
import crypto from 'crypto';
export default function passwordHasher({ password, salt }: { password: string, salt: string }) {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
            if (error) reject(error)

            resolve(hash.toString('hex').normalize())
        })
    })

}

export const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex').normalize()
}

export const verifyPassword = ({ password, salt, hash }: { password: string, salt: string, hash: string }) => {
    const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
    return hashedPassword === hash;
}