import bycrypt from 'bcrypt';

 export async function hashPassword (password) {
    const salt = await bycrypt.genSalt(10);
    const passwordHash = await bycrypt.hash(password, salt);
    return passwordHash;
}
