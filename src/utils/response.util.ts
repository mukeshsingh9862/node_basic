import { Response } from 'express'
import { encryption } from "./common.util"

export const responseWithStatus = (res: Response, status: number, responseData: any) => {
    if(status == 200){
        return res.status(status).send( encryption(responseData) );
    }
    return res.status(status).send( responseData );
}