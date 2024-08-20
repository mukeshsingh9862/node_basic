import { verifyToken } from "../utils/common.util";

const veirfyTokenKey = async (token: string) => {
    try {
        const decoded: any = await verifyToken(token);
        if (decoded) {
            return { status: true, message: "user details!", data: decoded };
        } else {
            return { status: false, message: "not valid!", data: null };
        }
    } catch (error: any) {
        return { status: false, message: "not valid!", data: null };
    }
}

export {
    veirfyTokenKey,
};