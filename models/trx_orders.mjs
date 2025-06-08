import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { mst_customers, mst_credit_cards, mst_users, ctl_statuses_orders, mst_virtual_credit_cards, rel_shipment_order, trx_shipments, mst_routers, trx_payments, mst_documents } from './index.mjs'
import rel_order_payment from './rel_order_payment.mjs'
class trx_orders extends psql.Model {
    static associate() {
        trx_orders.belongsTo(mst_customers, { foreignKey: 'id_customer' })
        trx_orders.belongsTo(mst_credit_cards, { foreignKey: 'id_credit_cards' })

        trx_orders.belongsTo(ctl_statuses_orders, { foreignKey: 'id_statuses_orders' })
        trx_orders.belongsTo(mst_users, { foreignKey: 'created_by' })
        trx_orders.belongsTo(mst_virtual_credit_cards, { foreignKey: 'id_virtual_credit_cards' })
        trx_orders.belongsTo(mst_routers, { foreignKey: 'id_router' })
        // trx_orders.hasMany(rel_shipment_order,{ foreignKey: 'id_order'} )
        trx_orders.belongsToMany(trx_shipments, {
            through: rel_shipment_order,
            foreignKey: 'id_order',
            otherKey: 'id_shipment',
        })

        trx_orders.belongsToMany(trx_payments, { 
            through: rel_order_payment,
            foreignKey: 'id_order',
            otherKey: 'id_payment',
        })

        trx_orders.hasMany(mst_documents, { foreignKey: 'id_orders'})

    }
}

trx_orders.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_customer: psql.INTEGER,
    // id_phone_number: psql.INTEGER,
    id_credit_cards: psql.INTEGER,
    id_router: psql.INTEGER,
    id_virtual_credit_cards: psql.INTEGER,
    id_statuses_orders: psql.INTEGER,
    account: psql.INTEGER,
    xfinity_user: psql.STRING,
    xfinity_password: psql.STRING,
    refill_payment_date: psql.STRING,
    created_by: psql.INTEGER,
    activation_address_country: psql.INTEGER,
    activation_address_street: psql.INTEGER,
    activation_address_street_2: psql.INTEGER,
    activation_address_house: psql.INTEGER,
    activation_address_state: psql.INTEGER,
    activation_address_city: psql.INTEGER,
    activation_address_zipcode: psql.INTEGER,
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'trx_orders',
    tableName: 'trx_orders',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default trx_orders