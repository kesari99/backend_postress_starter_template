import { Router } from "express";
import { API_ENDPOINTS } from "../shared/api";


const router = Router()


router.post(API_ENDPOINTS.AUTH.REGISTER.path, (req, res) => {

})

router.post(API_ENDPOINTS.AUTH.LOGIN.path, (req, res) => {

})

router.post(API_ENDPOINTS.AUTH.LOGOUT.path, (req, res) => {
    
})

export default router