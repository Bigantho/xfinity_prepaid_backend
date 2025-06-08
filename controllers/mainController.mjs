import { Op, where } from "sequelize"
import { mst_users, mst_customers, mst_virtual_phones_numbers, mst_credit_cards, mst_virtual_credit_cards, trx_orders, trx_payments, mst_routers, trx_shipments, rel_shipment_order, ctl_type_payments, ctl_statuses_routers, mst_documents, rel_order_payment, ctl_statuses_orders } from "../models/index.mjs"
import axios from "axios"
import DB from "../config/db.mjs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


// import fs from 'fs'
// import path from "path"
// import { fileURLToPath } from 'url';

export default class mainController {

    static async index(req, res) {
        try {
            const PRIVATE_TOKEN = process.env.CLOVER_PRIVATE_TOKEN;
            // const PUBLIC_TOKEN = process.env.CLOVER_PUBLIC_TOKEN;

            const options = {
                method: 'GET',
                // url: 'https://clover.com/recurring/v1/plans?active=true',
                // url: 'https://clover.com/recurring/v1/subscriptions',
                url: 'https://api.clover.com/recurring/v1/plans',

                headers: { accept: 'application/json', authorization: `Bearer ${PRIVATE_TOKEN}`, 'X-Clover-Merchant-Id': `${process.env.CLOVER_MERCHANT_ID}`, 'content-type': 'application/json', },
                // headers: { accept: 'application/json',apiKey: PUBLIC_TOKEN , 'Content-Type': 'application/json', 'X-Clover-Merchant-Id': `${process.env.CLOVER_MERCHANT_ID}` },

                // data: { interval: 'DAY', name: 'testapi', amount: 1 , intervalCount: 1}
                // 
            };
            // console.log(options);

            let response = ''
            await axios
                .request(options)
                .then(res => {
                    response = res.data
                })
                .catch(err => {
                    response = err.response.data
                });;

            console.log(response);

            // const users = await mst_users.findAll()
            return res.status(200).json(response)
        } catch (error) {

            return res.status(500).json({
                msg: "Something went wrong!",
                data: error
            })
        }
    }

    static async createUser(req, res) {
        try {
            const existUser = await mst_users.findAll({ where: { user: req.body.user } })

            if (existUser.length >= 1) {
                return res.status(400).json({
                    msg: "A user is already registered with that username."
                })
            }
            const userCreate = await mst_users.create(req.body)
            return res.status(200).json(userCreate)
        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!",
                error: error
            })
        }
    }

    static async createCustomer(req, res) {
        try {

            // const existPhoneNumber = await mainController.checkRecordExist(mst_virtual_phones_numbers, 1)

            // if (existPhoneNumber == false) {

            //     return res.status(400).json({
            //         msg: "Invalid phone number"
            //     })
            // }
            const existCustomer = await mst_customers.findAll({
                where: {
                    [Op.or]: [
                        {
                            phone_number: req.body.phone_number
                        },
                        {
                            email: req.body.email
                        }
                    ]
                }
            })

            if (existCustomer.length > 0) {
                return res.status(400).json({
                    msg: "A customer is already registered with that email or phone number."
                })
            }
            const dataSaved = {
                ...req.body,
                created_by: req.userId,
                //  We commented this cause the birthday wont be saved at this point
                // birthday: await mainController.convertDateToMySQL(req.body.birthday)
            }

            const customerCreate = await mst_customers.create(dataSaved)
            return res.status(200).json({
                msg: "Customer created.",
                record: customerCreate
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Something went wrong!",
                error: error
            })
        }
    }

    static async createPhoneNumber(req, res) {
        try {
            const existPhoneNumber = await mst_phones_numbers.findAll({
                where: {
                    number: req.body.number
                }
            })

            if (existPhoneNumber.length > 0) {
                return res.status(400).json({
                    msg: "A phone number is already registered with that number."
                })
            }

            const phoneNumberCreate = await mst_phones_numbers.create(req.body)

            return res.status(200).json(phoneNumberCreate)

        } catch (error) {
            return res.status(500).json({
                msg: "Mensaje enviado",
                error: error
            })
        }
    }

    static async updateCustomer(req, res) {

        const idCustomer = req.params.id_customer
        try {
            const existCustomer = await mst_customers.findByPk(idCustomer)
            if (existCustomer == null) {
                return res.status(200).json({
                    msg: "Any customer was found with that ID"
                })
            }

            const customerUpdated = await mst_customers.update(req.body, {
                where: {
                    id: idCustomer
                }
            })

            return res.status(200).json({
                msg: "Customer found.",
                data: customerUpdated
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Something went wrong!",
            })
        }
    }



    static async createOrder(req, res) {
        try {
            const orderCreated = await trx_orders.create(req.body)
            return res.status(200).json({
                msg: "Order created  successfully.",
                data: orderCreated
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    static async createCreditCard(req, res) {
        try {
            const existCreditCard = await mst_credit_cards.findAll({
                where: {
                    number: req.body.number
                }
            })

            if (existCreditCard.length > 0) {
                return res.status(400).json({
                    msg: "A Credit Card is already registered with that number."
                })
            }

            // TODO: Check that the customer exist

            const creditCardCreated = await mst_credit_cards.create(req.body)


            return res.status(200).json({
                msg: "Credit Card created successfully.",
                data: creditCardCreated
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async createVirtualCreditCard(data, t) {
        try {
            const existCreditCard = await mst_virtual_credit_cards.findAll({
                where: {
                    number: data.number
                }
            })

            if (existCreditCard.length > 0) {
                return {
                    status: false,
                    msg: "A Virtual Credit Card is already registered with that number."
                }
            }

            const creditCardCreated = await mst_virtual_credit_cards.create(data, { transaction: t })


            return {
                status: true,
                data: creditCardCreated
            }



        } catch (error) {
            console.log(error);

            return new Error('Error')
        }
    }

    static async createPayment(req, res) {
        try {
            const paymentCreated = await trx_payments.create(req.body)
            const paymentCreatedId = paymentCreated.id

            // Create the relationship between a payment and an order
            const assignedPaymentToOrder = await rel_order_payment.create({
                id_order: req.body.orderId,
                id_payment: paymentCreatedId
            })

            return res.status(200).json({
                msg: "Payment created successfully",
                data: paymentCreated
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Something went wrong."
            })
        }
    }

    static async checkRecordExist(model, pKey) {

        if (!model || !pKey) {
            throw new Error("Model and PrimaryKey are required.")
        }

        const record = await model.findByPk(pKey)

        return !!record;
    }

    static async selectTotalCustomer(req, res) {
        try {
            const totalCustomer = await mst_customers.findAll({
                include: [
                    {
                        model: mst_users
                    },
                    {
                        model: trx_orders
                    }
                ],
                order: [['created_at', 'DESC']]
            })


            const totalCustomerFormatted = totalCustomer.map((e, i) => ({
                id: e.id,
                position: i + 1,
                name: [e.name, e.last_name].join(' '),
                address: [e.address_street, e.address_house, e.address_city, e.address_state, e.address_zipcode].join(', '),
                address_object: { address_street: e.address_street, address_street_2: e.address_house, address_city: e.address_city, address_state: e.address_state, address_zipcode: e.address_zipcode },
                phoneNumber: e.phone_number,
                email: e.email,
                countOrders: e?.trx_orders.length,
                createdBy: [e.mst_user.name, e.mst_user.last_name].join(' '),
                createdAt: e.created_at
            }))


            return res.status(200).json({
                msg: "Total Customer",
                data: totalCustomerFormatted
                // data: totalCustomer
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: " Something went wrong!"
            })
        }
    }

    static async selectTotalPayment(req, res) {
        try {
            const totalPayment = await trx_payments.findAll({
                include: [
                    {
                        model: trx_orders,
                        include: {
                            model: mst_customers
                        }
                    },
                    {
                        model: ctl_type_payments,
                    }
                ],
                order: [['created_at', 'DESC']]
            })

            const totalPaymentTotal = totalPayment.map((e, i) => ({
                id: e.id,
                position: i + 1,
                account: e?.trx_orders[0]?.account ? e?.trx_orders[0]?.account : "-",
                customer: e?.trx_orders[0]?.mst_customer.name || e?.trx_orders[0]?.mst_customer.last_name ? [e?.trx_orders[0]?.mst_customer.name, e?.trx_orders[0]?.mst_customer.last_name].join(' ') : "-",
                amount: e?.ctl_type_payment?.amount,
                card_holder: e?.card_holder,
                chargedAt: e.created_at,
                trxId: e.trx_id
            }))

            return res.status(200).json({
                msg: "Total of payments",
                data: totalPaymentTotal
                // data: totalPayment
            })
        } catch (error) {

            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async selectTotalOrder(req, res) {
        try {
            const totalOrder = await trx_orders.findAll({
                // logging: console.log,
                include: [{
                    model: mst_customers,
                    attributes: ['name', 'last_name'],
                    include: {
                        model: mst_virtual_phones_numbers,
                        attributes: ['number']
                    }

                }, {
                    model: mst_routers,
                    attributes: ['correlative']
                }, {
                    model: ctl_statuses_orders,
                    attributes: ['name', 'id']
                }, {
                    model: trx_shipments,
                    attributes: ['tracking_number', 'status']
                }],
                where: {
                    // is_deleted: { [Op.or]: [{ [Op.not]: '1' }, { [Op.is]: null }] }
                    is_deleted: { [Op.not]: '1' }
                },
                order: [['created_at', 'DESC']]

            })

            const totalOrderCount = await trx_orders.count()

            const totalOrderFormatted = totalOrder.map((e, i) => ({
                id: e.id,
                position: i + 1,
                account: e.account,
                fullName: [e?.mst_customer.name, e?.mst_customer.last_name].join(" "),
                customerID: e.id_customer,
                virtualPhone: e?.mst_customer?.mst_virtual_phones_number?.number,
                xfinityUser: e?.xfinity_user,
                xfinityPassword: e?.xfinity_password,
                refillDate: e?.refill_payment_date,
                trackingNum: e?.trx_shipments[0]?.tracking_number,
                shipmentStatus: e?.trx_shipments[0]?.status,
                routerCorrelative: e?.mst_router?.correlative,
                statusOrder: {
                    name: e?.ctl_statuses_order?.name,
                    id: e?.ctl_statuses_order?.id
                }
                // creditCard: e?.mst_credit_card?.number,
                // virtualCreditCard: e?.mst_virtual_credit_card?.number,
            }))

            return res.status(200).json({
                msg: "Total order",
                correlativeCount: totalOrderCount,
                data: totalOrderFormatted
                // data: totalOrder
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async setCreditCardToOrder(req, res) {
        const connection = DB.connection();
        const t = await connection.transaction();

        const orderID = req.params.id_order

        try {
            const cdtCard = await mainController.createRampCreditCard(req.body)

            if (cdtCard == null) {
                res.status(500).json({
                    msg: "Something went wrong while the card is assigned."
                })
            }

            const cdtCardSaved = await mainController.createVirtualCreditCard(cdtCard, t)

            console.log("error caballo", cdtCardSaved);


            // if (cdtCardSaved.status) {
            //     console.log("KKOKOKOKOK", cdtCardSaved.data.id);
            // } else {
            //     return res.status(200).json({
            //         msg: cdtCardSaved.msg
            //     })
            // }
            console.log("maria");

            const orderChanged = await trx_orders.update({ cuenta: "2C666645666" }, {
                where: {
                    id: orderID
                },
                transaction: t
            })

            await t.commit()
            return res.status(200).json(orderChanged)

        } catch (error) {
            console.log("pepe");

            console.log(error);

            await t.rollback()

        }
    }

    static async createRampCreditCard(info) {
        console.log(info);

        setTimeout(() => {
            console.log("america");

        }, 4000)

        const db = {
            number: "",
            type: "VISA",
            card_holde1r: "ANTHONY VASQUEZ",
            cvc: "",
            exp_date: "",
            amount_available: "39.99",
            active: "1",
            is_deleted: "0"
        }



        return db
    }

    static async convertDateToMySQL(datePicked) {
        // Convert ISO 8601 to MySQL DateTime Value
        return new Date(datePicked).toISOString().slice(0, 19).replace('T', ' ');
    }

    static async createRouter(req, res) {
        try {
            //  Por defecto se le asigna el id 1 que es "Registered"
            const routerCretead = await mst_routers.create({ ...req.body, id_statuses_routers: 1 })
            return res.status(200).json({
                msg: "Router created"
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }




    }

    static async createVirtualPhoneNumber(req, res) {
        try {
            if (req.body.number == null || req.body.number == "") {
                return res.status(500).json({
                    msg: "Something went wrong!"
                })
            }
            const dataSaved = {
                ...req.body,
                acquired_by: req.userId
            }

            const newCreatedVirtualPhone = await mst_virtual_phones_numbers.create(dataSaved)

            const udtCustomerVirtualPhone = await mst_customers.update({
                id_virtual_phone_number: newCreatedVirtualPhone.id
            }, {
                where: {
                    id: req.body.id_customer
                }
            })

            return res.status(200).json({
                msg: "Virtual Phone Created",
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }

    }

    static async selectTotalRouter(req, res) {
        const { query } = req.query

        let where = []
        // let whereObj = {}
        // where.is_deleted = { [Op.or]: [{ [Op.not]: '1' }, { [Op.is]: null }] }

        if (query) {
            where.push({ serial: { [Op.substring]: query } })
            where.push({ mac_address: { [Op.substring]: query } })
        }

        try {
            const totalRouters = await mst_routers.findAll({
                // logging: console.log,
                // attributes: ['id'],
                include: [{
                    model: trx_orders,
                    required: false,
                    attributes: ['id', 'account', 'is_deleted'],
                    include: {
                        model: trx_shipments,
                        attributes: ['id']
                    },
                    where: {
                        is_deleted: { [Op.or]: [{ [Op.not]: '1' }, { [Op.is]: null }] }
                    }
                }, {
                    model: ctl_statuses_routers,
                    attributes: ['id', 'name']
                }],
                where: where.length > 0 ? { [Op.or]: where, is_deleted: 0 } : { is_deleted: 0 },
                order: [['created_at', 'DESC']]

            })

            const totalRoutersCounted = await mst_routers.count()
            // console.log(totalRoutersCounted);


            const totalRoutersFormatted = totalRouters.map((e, i) => {

                let wasShipped = false
                let accountNum = ""

                if (e.trx_orders.length > 0) {
                    accountNum = e.trx_orders[0].account
                    // if (e.trx_orders[0].trx_shipments) {
                    //     wasShipped = true
                    // }
                }
                let statusName = e?.ctl_statuses_router?.name
                return {
                    id: e.id,
                    position: i + 1,
                    status: statusName ? statusName : "-",
                    macAddress: e.mac_address,
                    name: e.name,
                    correlative: e.correlative,
                    // wasShipped: wasShipped,
                    account: accountNum ? accountNum : "-",
                    serial: e.serial,
                    brand: e.brand,
                    hasOrder: e?.trx_orders.length > 0 ? true : false,
                    createdAt: e.created_at
                }
            })

            // console.log(totalRoutersFormatted);

            return res.status(200).json({
                msg: 'Total Routers',
                correlativeCount: totalRoutersCounted,
                data: totalRoutersFormatted
                // data: totalRouters
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async placeOrder(req, res) {
        try {
            const dataSaved = {
                ...req.body,
                refill_payment_date: await mainController.convertDateToMySQL(req.body.refill_payment_date),
                id_statuses_orders: req.body.id_status_order
            }
            const orderPlaced = await trx_orders.create(dataSaved)

            const shippmentSaved = {
                shipping_carrier: req.body.shipping_carrier,
                tracking_number: req.body.tracking_num,
                status: 'Enviado'
            }

            const orderShippement = await trx_shipments.create(
                shippmentSaved
            )

            const shippmentOrder = await rel_shipment_order.create({
                id_shipment: orderShippement.id,
                id_order: orderPlaced.id
            })


            return res.status(200).json({
                msg: "Order placed"
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async selectRouterShipped(req, res) {
        try {
            const routerShipped = await mst_routers.findAll({
                include: {
                    model: trx_orders,
                    attributes: ['id', 'account'],
                    include: {
                        model: trx_shipments,
                        all: false,
                        attributes: ['id']
                    }
                }
            })

            const routerShippedFormatted = routerShipped.map((e, i) => ({
                position: i + 1,
                account: e?.trx_orders[0]?.account,
                brand: e.brand,
                routerCorrelative: e.correlative,
                shipped: e?.trx_orders[0]?.trx_shipments?.length > 0 ? true : false

            }))
            return res.status(200).json({
                msg: "Something went wrong!",
                data: routerShippedFormatted
                // data: routerShipped
            })
        } catch (error) {

            return res.status(500).json({
                msg: "Swomething went wrong!"
            })
        }
    }

    static async login(req, res) {
        const { user, password } = req.body

        try {
            const userRecord = await mst_users.findOne({ where: { user } })

            if (!userRecord) {
                return res.status(400).json({ error: "Authentication failed1" })
            }

            const passwordMatch = await bcrypt.compare(password, userRecord.password)

            if (!passwordMatch) {
                return res.status(400).json({ error: "Authentication failed2" })
            }

            const token = jwt.sign({ userId: userRecord.id }, process.env.SECRET_KEY, {
                expiresIn: process.env.TOKEN_TIME
            })

            return res.status(200).json({
                msg: "Login Success",
                data: {
                    token: token
                }
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Algo salio mal",
                error
            })
        }
    }

    static async register(req, res) {

        const { user, password, name, last_name, email } = req.body
        try {
            const hashedPassword = await bcrypt.hash(password, 10)

            const userRecord = await mst_users.create({
                name,
                last_name,
                user,
                email,
                password: hashedPassword,
                active: true

            })

            return res.status(200).json({
                msg: "Login Success",
                data: {
                    id: userRecord.id,
                    name: [userRecord.name, userRecord.last_name].join(" "),
                    user: userRecord.user

                }
            })
        } catch (error) {
            console.log("asdad", error);

            return res.status(500).json({
                msg: "Algo salio mal, contacte soporte tecnico.",
                error: error
            })
        }
    }

    static async deleteRouter(req, res) {
        const routerId = req.query.id
        try {

        } catch (error) {

        }
    }

    static async deleteOrder(req, res) {
        try {
            const orderId = req.params.id_order
            await trx_orders.update({
                is_deleted: true
            }, {
                where: {
                    id: orderId
                }
            })

            return res.status(200).json({
                msg: "Order delete!"
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async selectCatalogPayment(req, res) {
        try {
            const typePayments = await ctl_type_payments.findAll()

            return res.status(200).json({
                msg: "",
                data: typePayments
            })
        } catch (error) {

            return res.status(500).json({
                msg: "Something went wrong!",
            })
        }
    }

    static async selectCatalogRouter(req, res) {
        try {
            const totalRouter = await ctl_statuses_routers.findAll()
            res.status(200).json({
                msg: "Total routers",
                data: totalRouter
            })
        } catch (error) {
            res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async updateRouter(req, res) {
        try {
            const routerUpdated = await mst_routers.update(req.body, { where: { id: req.params.id_router } })
            res.status(200).json({
                msg: "Router Updated!"
            })
        } catch (error) {
            console.log(error);

            res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async uploadFileToOrder(req, res) {
        // const __filename = fileURLToPath(import.meta.url);

        // const __dirname = path.dirname(__filename);
        // const filePath = path.join(__dirname,'..', 'public/uploads/orders', 'example.txt'); // Cambia la ruta según necesites
        // // const fileName = 'example.txt';

        // const content = 'Hello, this is a text file created with Node.js!';
        // fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
        //     if (err) {
        //         console.error('Error creando directorio:', err);
        //         return;
        //     }

        //     fs.writeFile(filePath, content, (err) => {
        //         if (err) {
        //             console.error('Error escribiendo archivo:', err);
        //         } else {
        //             console.log(`Archivo creado con éxito en: ${filePath}`);
        //         }
        //     });
        // });
        // return res.status(200).json({msg: "error"})
        // return ;
        try {
            const docs = req.files
            // console.log(req.files);

            // const fileType = req.file.mimetype
            // const fileUuid = req.file.filename
            const idOrder = req.params.id_order

            // console.log(idOrder);

            const bulkSaved = docs.map(e => (
                {
                    uuid: e.filename,
                    id_orders: idOrder,
                    type: e.mimetype,
                    size: e.size
                }));
            // console.log(bulkSaved);

            const docSaved = await mst_documents.bulkCreate(bulkSaved)

            if (!req.files) {
                return res.status(400).send('No file uploaded');
            }

            res.status(200).json({
                msg: "Upload file", docSaved
            })
        } catch (error) {
            console.log(error);

            res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async selectFilesOrder(req, res) {
        try {

            const id_order = req.params.id_order


            const files = await mst_documents.findAll({
                where: {
                    id_orders: id_order,
                    is_deleted: 0
                }
            })

            // const filesFormatted = []
            const filesFormatted = files.map((e) => ({
                // filesFormatted.push(`${req.protocol}://${req.get('host')}/uploads/orders/${e.uuid}`)
                name: e.uuid,
                type: e.type,
                url: `${req.protocol}://${req.get('host')}/uploads/orders/${e.uuid}`
            }))
            res.status(200).json({
                msg: "Files",
                data: filesFormatted
            })
        } catch (error) {
            console.log(error);

            res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async makePayment(req, res) {
        try {
            const tokenCreated = await mainController.createCardToken(req.body)
            const PRIVATE_TOKEN = process.env.CLOVER_PRIVATE_TOKEN;

            if (!tokenCreated.status) {
                return res.status(500).json({
                    msg: "Something went wrong!",
                    err: tokenCreated.data
                })
            }

            const options = {
                method: 'POST',
                url: 'https://scl.clover.com/v1/charges',
                headers: { accept: 'application/json', authorization: `Bearer ${PRIVATE_TOKEN}` },
                data: {
                    ecomind: 'moto',
                    metadata: { existingDebtIndicator: false },
                    amount: Number(req.body.amount) * 100,
                    currency: 'USD',
                    source: tokenCreated.data.id
                }
            };

            let paymentMade = ""
            let isError = {}
            await axios
                .request(options)
                .then((res) => paymentMade = res.data)
                .catch(err => isError = { status: true, err: err?.response?.data?.error?.message });

            if (isError.status) {
                return res.status(500).json({
                    msg: "Something went wrong!",
                    err: isError.err
                })
            }

            let enumBrand = ''
            switch (req.body.brand) {
                case 'VISA':
                    enumBrand = 'VISA'
                    break;
                case 'MC':
                    enumBrand = "Master Card"
                    break;
                case 'AMEX':
                    enumBrand = "American Express"
                    break;
                default:
                    break;
            }


            const paymentSaved = await trx_payments.create({
                trx_id: paymentMade.id,
                id_type_payments: req.body.id_type_payment,
                card_number: req.body.number,
                card_holder: req.body.card_holder,
                card_type: enumBrand,
                card_cvc: req.body.cvv,
                card_exp_date: [req.body.exp_month, req.body.exp_year].join('')
            })


            const creditCardObj = {
                number: req.body.number,
                type: enumBrand,
                card_holder: req.body.card_holder,
                cvc: req.body.cvv,
                exp_date: [req.body.exp_month, req.body.exp_year].join(''),

            }

            // const newCreditCard = await mst_credit_cards.create(creditCardObj)

            return res.status(200).json({
                msg: "Payment Created",
                paymentMade: paymentMade,
                // creditCard: newCreditCard
            })
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                msg: "Something went wrong!",
                error
            })
        }
    }

    static async createCardToken(card) {
        try {
            const PUBLIC_TOKEN = process.env.CLOVER_PUBLIC_TOKEN
            const options = {
                method: 'POST',
                // url: 'https://scl.clover.com/pakms/apikey', // Create Key de acceso
                url: 'https://token.clover.com/v1/tokens',
                headers: { accept: 'application/json', apiKey: PUBLIC_TOKEN, 'Content-Type': 'application/json' },
                data: {
                    card: {
                        // encrypted_pan: "{encrypted_card_number}",   
                        brand: card.brand,
                        number: card.number,
                        exp_month: card.exp_month,
                        exp_year: card.exp_year,
                        cvv: String(card.cvv),
                        last4: card.number.slice(-4),
                        first6: card.number.slice(0, 6)
                    }
                }
            };

            const response = await axios
                .request(options)
                .then(res => ({ status: true, data: res.data }))
                .catch(err => ({ status: false, data: err?.response?.data?.error?.message }));
            return response
        } catch (error) {
            return { data: error, status: false }
        }
    }

    static async selectTotalCreditCard(req, res) {
        try {

            const creditCards = await mst_credit_cards.findAll({
                order: [['created_at', 'DESC']]
            })

            return res.status(200).json({
                msg: "Total Credit Card",
                data: creditCards
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Total Credit Card"
            })
        }
    }

    static async selectTotalCreditCardByCustomer(req, res) {
        try {
            const customerID = req.params.id_customer

            const creditCards = await mst_credit_cards.findAll({
                where: {
                    id_customer: customerID
                }
            })

            return res.status(200).json({
                msg: "Total Credit Card",
                data: creditCards
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Total Credit Card"
            })
        }
    }

    static async selectCatalogOrder(req, res) {
        try {

            const catalog = await ctl_statuses_orders.findAll()

            return res.status(200).json({
                msg: "Catalog Order",
                data: catalog
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async updateOrder(req, res) {
        try {

            const orderUpdated = await trx_orders.update(req.body, { where: { id: req.params.id_order } })
            return res.status(200).json({
                msg: "Ordered updated",
                data: orderUpdated
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async assignPaymentOrder(req, res) {
        try {

            const { orderID, paymentID } = req.body

            const existOrder = await trx_orders.findByPk(orderID)

            if (existOrder == null) {
                return res.status(500).json({
                    msg: "Order does not exits!"
                })
            }

            const existPayment = await trx_payments.findByPk(paymentID)

            if (existPayment == null) {
                return res.status(500).json({
                    msg: "Payment does not exits!"
                })
            }

            const existRelationship = await rel_order_payment.findAll({ where: { id_payment: paymentID } })

            if (existRelationship.length > 0) {
                return res.status(500).json({
                    msg: "The payment is already related with a order."
                })
            }

            const orderPayment = await rel_order_payment.create({ id_order: orderID, id_payment: paymentID })


            return res.status(200).json({
                msg: "Payment Assigned Correctly",
                data: orderPayment
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async getCustomersClover(req, res) {
        try {
            const PRIVATE_TOKEN = process.env.CLOVER_PRIVATE_TOKEN;
            const options = {
                method: 'GET',
                url: `https://api.clover.com/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/customers`,
                headers: { accept: 'application/json', authorization: `Bearer ${PRIVATE_TOKEN}` },
            };
            let response = ''
            await axios
                .request(options)
                .then(res => {
                    response = res.data
                })
                .catch(err => {
                    response = err.response.data
                });;

            return res.status(200).json({
                msg: "Clientes obtenido exitosamente.",
                data: response
            })

        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!",
                data: error
            })
        }
    }

    static async getPlansClover(req, res) {
        try {
            const PRIVATE_TOKEN = process.env.CLOVER_PRIVATE_TOKEN;
            const options = {
                method: 'GET',
                url: 'https://api.clover.com/recurring/v1/plans/AZPNAZKEFXA7G',
                headers: { accept: 'application/json', authorization: `Bearer ${PRIVATE_TOKEN}`, 'X-Clover-Merchant-Id': `${process.env.CLOVER_MERCHANT_ID}`, 'content-type': 'application/json', },
            };
            let response = ''
            await axios
                .request(options)
                .then(res => {
                    response = res.data
                })
                .catch(err => {
                    response = err.response.data
                });;


            return res.status(200).json({
                msg: "Plans",
                data: response,
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!",
                data: error
            })
        }
    }

    static async createSuscriptionPlanClover(req, res) {
        try {
            const PRIVATE_TOKEN = process.env.CLOVER_PRIVATE_TOKEN;
            const options = {
                method: 'POST',
                url: `https://api.clover.com/recurring/v1/plans/Y5963X10X45MG/subscriptions`,
                headers: { accept: 'application/json', authorization: `Bearer ${PRIVATE_TOKEN}`, 'X-Clover-Merchant-Id': `${process.env.CLOVER_MERCHANT_ID}`, 'content-type': 'application/json', },
                data: { collectionMethod: 'CHARGE_AUTOMATICALLY', customerId: '5E4HBG57JWEB8', startDate: '2025-02-20T13:46:15+00:00' }

            };
            let response = ''
            await axios
                .request(options)
                .then(res => {
                    response = res.data
                })
                .catch(err => {
                    response = err.response.data
                });;


            return res.status(200).json({
                msg: "Plans",
                data: response,
            })

        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async createPlanClover(req, res) {
        try {
            const PRIVATE_TOKEN = process.env.CLOVER_PRIVATE_TOKEN;
            const options = {
                method: 'POST',
                url: 'https://api.clover.com/recurring/v1/plans',
                headers: { accept: 'application/json', authorization: `Bearer ${PRIVATE_TOKEN}`, 'X-Clover-Merchant-Id': `${process.env.CLOVER_MERCHANT_ID}`, 'content-type': 'application/json', },
                data: { interval: 'DAY', name: 'testplan2', amount: 1, intervalCount: 1 }

            };
            let response = ''
            await axios
                .request(options)
                .then(res => {
                    response = res.data
                })
                .catch(err => {
                    response = err.response.data
                });;


            return res.status(200).json({
                msg: "Plans",
                data: response,
            })

        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async createCustomerClover(req, res) {
        try {
            const PRIVATE_TOKEN = process.env.CLOVER_PRIVATE_TOKEN;
            const options = {
                method: 'POST',
                url: `https://api.clover.com/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/customers`,
                headers: { accept: 'application/json', authorization: `Bearer ${PRIVATE_TOKEN}`, 'X-Clover-Merchant-Id': `${process.env.CLOVER_MERCHANT_ID}`, 'content-type': 'application/json', },
                // data: { interval: 'DAY', name: 'testplan2', amount: 1, intervalCount: 1 }

            };
            let response = ''
            await axios
                .request(options)
                .then(res => {
                    response = res.data
                })
                .catch(err => {
                    response = err.response.data
                });;


            return res.status(200).json({
                msg: "Customers",
                data: response,
            })

        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!"
            })
        }
    }

    static async getSubscriptionTotal(req, res){
        try {
            const PRIVATE_TOKEN = process.env.CLOVER_PRIVATE_TOKEN;
            const options = {
                method: 'GET',
                url: 'https://api.clover.com/recurring/v1/subscriptions',
                headers: { accept: 'application/json', authorization: `Bearer ${PRIVATE_TOKEN}`, 'X-Clover-Merchant-Id': `${process.env.CLOVER_MERCHANT_ID}`, 'content-type': 'application/json', },
            };
            let response = ''
            await axios
                .request(options)
                .then(res => {
                    response = res.data
                })
                .catch(err => {
                    response = err.response.data
                });;


            return res.status(200).json({
                msg: "Plans",
                data: response,
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Something went wrong!",
                data: error
            })
        }
    }
}   
