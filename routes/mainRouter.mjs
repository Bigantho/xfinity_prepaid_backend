import mainController from '../controllers/mainController.mjs'
import { Router } from 'express'
import { verifyToken } from "../utils/middleware/authMiddleware.mjs"
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url';
import fs from 'fs'
// Configure multer storage
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const storageOrder = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define where to save the uploaded file
        let dir = path.join(__dirname, '..', 'public/uploads/orders')
        cb(null, dir);  // The folder where files will be saved
    },
    filename: function (req, file, cb) {
        // Define the filename format (e.g., using the original name)

        cb(null, uuidv4() + path.extname(file.originalname));  // Unique filename with extension
        // cb(null, uuidv4())
    },

});
const uploadOrder = multer({
    storage: storageOrder, fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'application/pdf'];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept file
        } else {
            cb(new Error('Only PNG and PDF files are allowed!'), false); // Reject file
        }
    }, 
    limits: { fileSize: 5 * 1024 * 1024 }, 
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
})




const router = Router()



router.get('/ts', mainController.index)
router.get('/customer/total', verifyToken, mainController.selectTotalCustomer)
router.get('/payment/total', verifyToken, mainController.selectTotalPayment)

router.get('/order/total', verifyToken, mainController.selectTotalOrder)
router.get('/order/files/:id_order', verifyToken, mainController.selectFilesOrder)
router.get('/order/catalog', verifyToken, mainController.selectCatalogOrder)

router.get('/router/total', verifyToken, mainController.selectTotalRouter)
router.get('/router/shipped', verifyToken, mainController.selectRouterShipped)
router.get('/router/catalog', verifyToken, mainController.selectCatalogRouter)

router.get('/payment/catalog', verifyToken, mainController.selectCatalogPayment)

router.get('/credit_card/total', verifyToken, mainController.selectTotalCreditCard)
router.get('/credit_card/total/:id_customer', verifyToken, mainController.selectTotalCreditCardByCustomer)

router.get('/clover/customer/total', mainController.getCustomersClover)
router.get('/clover/plan/total', mainController.getPlansClover)
router.get('/clover/subscription/total', mainController.getSubscriptionTotal)

router.post('/router/create', verifyToken, mainController.createRouter)
router.post('/router/delete', verifyToken, mainController.deleteRouter)

router.post('/user/create', verifyToken, mainController.createUser)

router.post('/customer/create', verifyToken, mainController.createCustomer)
router.post('/customer/update/:id_customer', verifyToken, mainController.updateCustomer)

router.post('/phone_number/create', verifyToken, mainController.createPhoneNumber)

router.post('/virtual_phone_number/create', verifyToken, mainController.createVirtualPhoneNumber)

router.post('/order/create', verifyToken, mainController.createOrder)
router.post('/order/:id_order/add_credit_card', verifyToken, mainController.setCreditCardToOrder)
router.post('/order/place', verifyToken, mainController.placeOrder)
router.post('/order/files/upload/:id_order', verifyToken, uploadOrder.array('file'), mainController.uploadFileToOrder)

// router.post('/order/files/upload/:id_order', verifyToken, mainController.uploadFileToOrder)

router.post('/credit_card/create', verifyToken, mainController.createCreditCard)

// router.post('/virtual_credit_card/create', mainController.createVirtualCreditCard)

router.post('/payment/create', verifyToken, mainController.createPayment)
router.post('/payment/make', mainController.makePayment)
router.post('/payment/assign_order', mainController.assignPaymentOrder)

router.post('/auth/login', mainController.login)
router.post('/auth/register', mainController.register)

router.post('/ramp/user', mainController.createRampToken)

router.post('/clover/plan/create', mainController.createPlanClover)
router.post('/clover/subscription/create', mainController.createSuscriptionPlanClover)
router.post('/clover/customer/create', mainController.createCustomerClover)




router.put('/order/:id_order/delete', verifyToken, mainController.deleteOrder)
router.put('/order/update/:id_order', verifyToken, mainController.updateOrder)

router.put('/router/update/:id_router', verifyToken, mainController.updateRouter)



export default router