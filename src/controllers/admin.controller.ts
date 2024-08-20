import { Request, Response } from 'express';
import { Body, Controller, Post, Route, Tags } from 'tsoa';
import { findOne } from '../helpers/db.helpers';
import { IResponse } from '../utils/interfaces.util';
// import { verifyHash, signToken, genHash } from '../utils/common.util';
import logger from '../configs/logger.config';
import { ADMIN_ROLE, MESSAGES, SubAdmin_ROLE } from '../constants/user.constants';
import adminModel from '../models/admin.model';
import {
    signToken,
    verifyHash
} from "../utils/common.util";


@Tags('Admin')
@Route('api/admin')
export default class AdminController extends Controller {
    req: Request;
    res: Response;
    userId: string;
    userIP: string;
    constructor(req: Request, res: Response) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : '';
        this.userIP = req.body.userIP ? req.body.userIP : '';
    }

    /**
    * Login subAdmin / admin
    */
    @Post("/login")
    public async login(@Body() request: { email: string, password: string }): Promise<IResponse> {
        try {
            const { email, password } = request;
            // Check User Found or Not
            let exists = await findOne(adminModel, { email: email, role: [`${ADMIN_ROLE}`, `${SubAdmin_ROLE}`], });
            if (!exists) {
                throw new Error(MESSAGES.INVAILD_USER);
            }
            // check if User Verify
            if (exists.is_deleted == true) {
                throw new Error(MESSAGES.USER_NOT_VERIFY);
            }

            if (exists.is_blocked == true) {
                throw new Error(MESSAGES.BLOCKED_BY_ADMIN);
            }

            const isValid = await verifyHash(password, exists.password);
            console.log(isValid);
            if (!isValid) {
                throw new Error(MESSAGES.INVAILD_PASSWORD);
            }
            let token = await signToken(exists._id, { role: exists.role })
            
            return {
                data: { exists, token },
                error: '',
                message: MESSAGES.OTP_SENT,
                status: 200
            }
        }
        catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`)
            return {
                data: null,
                error: err.message ? err.message : err,
                message: '',
                status: 400
            }
        }
    }

}


