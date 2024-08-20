import express, { Request, Response } from 'express'
import AdminController from '../../controllers/admin.controller'
import { ipAddressSave } from '../../middlewares/auth.middleware'
import { responseWithStatus } from '../../utils/response.util'

const router = express.Router()
router.post('/login', ipAddressSave, async (req: Request | any, res: Response) => {
    const { email, password } = req.body;
    console.log(email);
    const controller = new AdminController(req, res)
    const response = await controller.login({ email, password });
    const { status } = response;
    return responseWithStatus(res, status, response)
})

module.exports = router
