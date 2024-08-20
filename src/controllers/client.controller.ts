// @ts-ignore
import { Request, Response } from 'express';
import mongoose from "mongoose";
import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    Route,
    Security,
    Tags
} from "tsoa";
import logger from "../configs/logger.config";
import {
    ADMIN_ROLE,
    MESSAGES,
    USER_ROLE
} from "../constants/user.constants";
import {
    deleteById,
    findOne,
    upsert
} from "../helpers/db.helpers";
import clientModel from "../models/client.model";
import { IResponse } from "../utils/interfaces.util";
import { validateObjectId } from "../validations/objectId.validator";
import { validateUserLogin, validateUserSave } from "../validations/user.validator";

@Tags("Client")
@Route("api/client")
export default class ClientController extends Controller {
    req: Request;
    res: Response;
    userId: string;
    userIP: string;
    userRole: number;
    constructor(req: Request, res: Response) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : "";
        this.userRole = req.body.user ? req.body.user.role : null;
        this.userIP = req.body.userIP ? req.body.userIP : '';
    }

    /**
     * Save a client 
     */
    @Post("/save")
    public async save(
        @Body()
        request: {
            date_of_birth: string;
            user_name: string;
            email: string;
            first_name?: string;
            last_name?: string;
            password: string;
            phone_number: number;
            language: string;
            my_referral_code?: string;
            country: string;
            country_flag?: string;
            country_code?: string;
            phone_code?: string;
            user_type: string;
            date_of_establishment: string;
            company_name: string;
            device_token: string;
        }
    ): Promise<IResponse> {
        try {
            let { date_of_birth, email, first_name, last_name, password, phone_number, language, my_referral_code, country, country_flag, country_code, user_name, user_type, company_name, date_of_establishment, device_token } = request;
            if (!company_name) {
                const validatedUser = validateUserSave({ first_name, last_name, email, password, user_name });
                if (validatedUser.error) {
                    throw new Error(validatedUser.error.message);
                }
            }

            let saveResponse;
            let token;
            email = email.toLowerCase()
            user_name = user_name.toUpperCase()
            // check if client exists
            const existsEmail = await findOne(clientModel, {
                email: email,
                role: USER_ROLE,
            });
            const existsNumber = await findOne(clientModel, {
                phone_number: phone_number,
            });
            const existsUserName = await findOne(clientModel, {
                user_name: user_name,
            });

            if (existsUserName) {
                throw new Error(MESSAGES.USERNAME_ALREADY_EXISTS);
            }
            if (existsEmail) {
                throw new Error(MESSAGES.EMAIL_ALREADY_EXISTS);
            }

            if (existsNumber) {
                throw new Error(MESSAGES.NUMBER_ALREADY_EXISTS);
            }

            return {
                data: { token },
                error: "",
                message: MESSAGES.USER_REGISTER_SUCCESS,
                status: 200,
            };
        } catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`);
            return {
                data: null,
                error: err.message ? err.message : err,
                message: "",
                status: 400,
            };
        }
    }

    /**
     * User login/user 
     */
    @Post("/login")
    public async login(
        @Body()
        request: {
            user_name: string;
            email: string;
            password: string;
            browser: string;
            device: string;
            latitude: string;
            longitude: string;
            location: string;
            device_token: string;
        }
    ): Promise<IResponse> {
        try {
            let {
                user_name,
                email,
                password,
                browser,
                device,
                latitude,
                longitude,
                location,
                device_token,
            } = request;

            const validatedUser = validateUserLogin({ email, password, user_name });
            // console.log(validatedUser);
            if (validatedUser.error) {
                throw new Error(validatedUser.error.message);
            }

            return {
                data: '',
                error: "",
                message: MESSAGES.USER_LOGIN_SUCCESS,
                status: 200,
            };
        } catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`);
            return {
                data: null,
                error: err.message ? err.message : err,
                message: "",
                status: 400,
            };
        }
    }

    /**
     * Get user info/admin
     */
    @Security("Bearer")
    @Get("/me")
    public async me(): Promise<IResponse> {
        try {

            const getResponse = await findOne(clientModel, { _id: new mongoose.Types.ObjectId(this.userId) });
            return {
                data: getResponse || {},
                error: "",
                message: MESSAGES.INFO_FETCHED,
                status: 200,
            };
        } catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`);
            return {
                data: null,
                error: err.message ? err.message : err,
                message: "",
                status: 400,
            };
        }
    }

    /**
     * Account Deletion for user/ admin, require user auth
     */
    @Security("Bearer")
    @Delete("/deleteAccount")
    public async deleteAccount(): Promise<IResponse> {
        try {

            let deleted;
            let saveResponse
            var payload: { [k: string]: any } = {};
            const validated = await validateObjectId(this.userId);
            if (validated.error) {
                throw new Error(validated.error.message);
            }
            let checkAdmin = await findOne(clientModel, { _id: this.userId, role: ADMIN_ROLE })
            if (checkAdmin) {
                throw new Error('Admin Not Deleted!')
            } else {
                let user = await findOne(clientModel, { _id: this.userId })
                payload.profile_pic = null;
                saveResponse = await upsert(clientModel, payload, user._id);
            }

            return {
                data: saveResponse,
                error: "",
                message: MESSAGES.DELETE_SUCCESSFULLY,
                status: 200,
            };
        } catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`);
            return {
                data: null,
                error: err.message ? err.message : err,
                message: "",
                status: 400,
            };
        }
    }

    /**
     * Delete a User
     */
    @Security("Bearer")
    @Delete("/deleteUser")
    public async deleteUser(@Query() id: string): Promise<IResponse> {
        try {
            let deleted;

            const validated = await validateObjectId(id);
            if (validated.error) {
                throw new Error(validated.error.message);
            }
            let checkAdmin = await findOne(clientModel, { _id: new mongoose.Types.ObjectId(id), role: 1 })
            if (checkAdmin) {
                throw new Error('Admin Not Deleted!')
            } else {
                deleted = await deleteById(clientModel, id);
                if (!deleted) {
                    throw new Error(MESSAGES.INVAILD_USER);
                }
            }
            return {
                data: deleted,
                error: "",
                message: MESSAGES.DELETE_SUCCESSFULLY,
                status: 200,
            };
        } catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`);
            return {
                data: null,
                error: err.message ? err.message : err,
                message: "",
                status: 400,
            };
        }
    }

}