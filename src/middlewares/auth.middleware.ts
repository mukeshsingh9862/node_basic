import { Request, Response, NextFunction } from 'express';
import { verifyToken, verifyTokenForgot } from '../utils/common.util'
import { responseWithStatus } from '../utils/response.util';
import { USER_ROLE, ADMIN_ROLE, SubAdmin_ROLE } from '../constants/user.constants';
import moment from 'moment';
import { decryptionKey } from '../utils/common.util';


const veirfySecretKey = async (req: Request, res: Response) => {

    const endpoint = req.originalUrl;
    let key = req.headers['x-key'];

    if ((key != "fromapplication") && (endpoint != "/health") && (endpoint != "/swagger/")) {
        let result = await decryptionKey(key);
        if (!result.key) {
            console.log(result.key, 'notfound result.key >>>>>>>>>')
        }

        if (result.key != "vWuil4$KClpEv@RL#LByEiH1sbB$a4DsW&$08m") {

            return 'Sorry, this request not valid!!';
        }

        let currentDateTime = moment.utc().format("YYYY-MM-DDTHH:mm:ss");
        let differenceTime = await getTimeDifference(result.time, currentDateTime);

        if (differenceTime > 1500) {

            console.log(differenceTime, 'differenceTime>>>>')
            return 'Sorry, this request time expired!!';
        }
    }
    return 'success';
}

function getTimeDifference(dateOne: any, dateTwo: any) {
    var date1: any = new Date(dateOne);
    var date2: any = new Date(dateTwo);

    var timeDifference = date2 - date1;

    // Convert the time difference to seconds, minutes, hours, etc.
    var seconds = timeDifference / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;

    console.log("Time Difference in Minutes: " + minutes);

    return minutes;
}


export const ipAddressSave = (req: Request, res: Response, next: NextFunction) => {
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const forwardedFor = req.headers['x-forwarded-for'];
    console.log('User IP:', userIP);
    req.body.userIP = forwardedFor;
    next();
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (authHeader) {
        const decoded: any = verifyToken(authHeader);
        if (decoded) {
            // @ts-ignore
            if (decoded?.role == USER_ROLE) {
                req.body.user = decoded;

                let output = await veirfySecretKey(req, res);
                if (output != "success") {

                    console.error(output, decoded?.id, "output error >>>>>>>");
                    return responseWithStatus(res, 400, {
                        data: null,
                        error: output,
                        message: '',
                        status: 400
                    })
                }

                next();
            } else {
                return responseWithStatus(res, 400, {
                    data: null,
                    error: 'Session error, Please login again!',
                    message: '',
                    status: 400
                })
            }
        } else {
            return responseWithStatus(res, 400, {
                data: null,
                error: 'Session expired, Please login again!',
                message: '',
                status: 401
            })
        }
    } else {
        return responseWithStatus(res, 400, {
            data: null,
            error: 'Session not valid, Please login again!',
            message: '',
            status: 401
        })
    }
}

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (authHeader) {
        const decoded: any = verifyToken(authHeader);
        if (decoded) {
            // @ts-ignore
            if (decoded?.role == ADMIN_ROLE || decoded?.role == SubAdmin_ROLE) {
                req.body.user = decoded;


                let output = await veirfySecretKey(req, res);
                if (output != "success") {

                    console.error(output, decoded?.id, "output error >>>>>>>");
                    return responseWithStatus(res, 400, {
                        data: null,
                        error: output,
                        message: '',
                        status: 400
                    })
                }

                next();
            } else {
                return responseWithStatus(res, 400, {
                    data: null,
                    error: 'Session error, Please login again!',
                    message: '',
                    status: 400
                })
            }
        } else {
            return responseWithStatus(res, 400, {
                data: null,
                error: 'Session expired, Please login again!',
                message: '',
                status: 400
            })
        }
    } else {
        return responseWithStatus(res, 400, {
            data: null,
            error: 'Session not valid, Please login again!',
            message: '',
            status: 400
        })
    }
}

export const authenticateBoth = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (authHeader) {
        const decoded: any = verifyToken(authHeader);
        // @ts-ignore
        if (decoded && decoded?.role == ADMIN_ROLE || decoded?.role == USER_ROLE || decoded?.role == SubAdmin_ROLE) {
            req.body.user = decoded;


            let output = await veirfySecretKey(req, res);
            if (output != "success") {

                console.error(output, decoded?.id, "output error >>>>>>>");
                return responseWithStatus(res, 400, {
                    data: null,
                    error: output,
                    message: '',
                    status: 400
                })
            }

            next();
        } else {
            return responseWithStatus(res, 400, {
                data: null,
                error: 'Session error, Please login again!',
                message: '',
                status: 401
            })
        }
    } else {
        return responseWithStatus(res, 400, {
            data: null,
            error: 'Session not valid, Please login again!',
            message: '',
            status: 401
        })
    }
}

export const authenticateBothForgot = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const decoded = verifyTokenForgot(authHeader);
        // @ts-ignore
        if (decoded && decoded?.role == ADMIN_ROLE || decoded?.role == USER_ROLE || decoded?.role == SubAdmin_ROLE) {
            req.body.user = decoded;
            next();
        } else {
            return responseWithStatus(res, 400, {
                data: null,
                error: 'Session expired, Please login again!',
                message: '',
                status: 401
            })
        }
    } else {
        return responseWithStatus(res, 400, {
            data: null,
            error: 'Session expired, Please login again!',
            message: '',
            status: 401
        })
    }
}

