import express, { Request, Response } from 'express'
import ClientController from '../../controllers/client.controller'
import { authenticateAdmin, authenticateBoth } from '../../middlewares/auth.middleware'
import { responseWithStatus } from '../../utils/response.util'
const router = express.Router()

router.post('/save', async (req: Request | any, res: Response) => {
    const { date_of_birth, user_name, email, first_name, last_name, password, phone_number, language, my_referral_code, country,country_flag,country_code, user_type, date_of_establishment, company_name ,device_token} = req.body;
    const controller = new ClientController(req, res)
    const response = await controller.save({ date_of_birth, user_name, email, first_name, last_name, password, phone_number, language, my_referral_code, country,country_flag,country_code, user_type, date_of_establishment, company_name,device_token });
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.post('/login', async (req: Request | any, res: Response) => {
    const { user_name, email, password, browser, device, latitude, longitude, location,device_token} = req.body;
    const controller = new ClientController(req, res)
    const response = await controller.login({ user_name, email, password, browser, device, latitude, longitude, location,device_token });
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.get('/me', authenticateBoth, async (req: Request | any, res: Response) => {
    const controller = new ClientController(req, res)
    const response = await controller.me();
    const { status } = response;
    return responseWithStatus(res, status, response)
})


router.delete('/deleteAccount', authenticateBoth, async (req: Request | any, res: Response) => {
    const controller = new ClientController(req, res)
    const response = await controller.deleteAccount();
    const { status } = response;
    return responseWithStatus(res, status, response)
})


router.delete('/deleteUser', authenticateAdmin, async (req: Request | any, res: Response) => {
    const { id } = req.query;
    const controller = new ClientController(req, res)
    const response = await controller.deleteUser(id);
    const { status } = response;
    return responseWithStatus(res, status, response)
})


module.exports = router
