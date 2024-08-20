import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { CRYPTO } from '../constants/user.constants';
const speakeasy = require('speakeasy');
const cryptoJS = require('crypto-js');

export const encrypt = (db_password: string) => {

    return new Promise((resolve, reject) => {
        const iv = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv(CRYPTO.ALGO, CRYPTO.PWD, iv)
        var crypted = cipher.update(db_password, 'utf8', 'hex')
        crypted += cipher.final('hex');
        resolve(crypted);
    })
}

export const decrypt = (db_password: string) => {
    const iv = crypto.randomBytes(16);
    var decipher = crypto.createDecipheriv(CRYPTO.ALGO, CRYPTO.PWD, iv);
    var crypt = decipher.update(db_password, 'hex', 'utf8') + decipher.final('utf8');
    return crypt;
}

export const genHash = (stringValue: string): Promise<string> => {
    return new Promise((res, rej) => {
        bcrypt.genSalt(10, function (err: any, salt: string) {
            if (err) {
                rej(err.message)
            }
            bcrypt.hash(stringValue, salt, async (err: any, hash: string) => {
                if (err) {
                    rej(err.message)
                }
                res(hash);
            });
        });
    })
}
export const verifyHash = (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
}

export const convertIdToObjectId = (id: string) => {
    return new Types.ObjectId(id);
}


export const signToken = async (id: string, extras = {}, expiresIn = 60 * 60) => {
    return new Promise((res, rej) => {
        jwt.sign({ id, ...extras }, process.env.SECRET as string, {
            expiresIn
        }, (err: any, encoded: any) => {
            if (err) {
                rej(err.message);
            } else {
                res(encoded);
            }
        })
    })
}


export const signTokenForgot = async (id: string, extras = {}, expiresIn = 5 * 60) => {
    return new Promise((res, rej) => {
        jwt.sign({ id, ...extras }, "secret_forgot", {
            expiresIn
        }, (err: any, encoded: any) => {
            if (err) {
                rej(err.message);
            } else {
                res(encoded);
            }
        })
    })
}

export const signTokenAdmin = async (id: string, extras = {}, expiresIn = 60 * 60) => {
    return new Promise((res, rej) => {
        jwt.sign({ id, ...extras }, process.env.SECRET as string, {
            expiresIn
        }, (err: any, encoded: any) => {
            if (err) {
                rej(err.message);
            } else {
                res(encoded);
            }
        })
    })
}


export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET as string);
        return decoded;
    }
    catch (err) {
        return null;
    }
}

export const verifyTokenForgot = (token: string) => {
    try {
        const decoded = jwt.verify(token, "secret_forgot");
        return decoded;
    }
    catch (err) {
        return null;
    }
}

export const camelize = (str: string) => {
    try {
        str = str.trim().split(' ').join('_')
        return str
    }
    catch (err) {
        return null;
    }
}

export const generateSecretKey = () => {
    const secret = speakeasy.generateSecret({
        name: process.env.SECRET_KEY || '',
    });
    return secret.base32;
}
export const generateQRCode = (secret: any, username: string) => {
    return new Promise((resolve, reject) => {
        resolve('testingurl');
    });
};
export const verifyQrOTP = (secret: any, otp: string) => {

    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: otp,
        window: 1
    });
};


export const encryption = (data: any) => {
    if(process.env.ENCODEKEY){
        var ciphertext = cryptoJS.AES.encrypt(JSON.stringify(data), process.env.ENCODEKEY).toString();
        return ciphertext;
    }else{
        return data;
    }
}

export const decryptionKey = (data: any) => {
    
    try {
        const decryptedBytes = cryptoJS.AES.decrypt(data, process.env.ENCODEKEY);
        const decryptedText = decryptedBytes.toString(cryptoJS.enc.Utf8);
        return JSON.parse(decryptedText);
    } catch (error) {
        console.error("Decryption error:", error);
        return "false"
    }
}