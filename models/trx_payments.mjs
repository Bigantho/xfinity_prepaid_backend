import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { ctl_type_payments, trx_orders } from './index.mjs'
import rel_order_payment from './rel_order_payment.mjs'
class trx_payments extends psql.Model {
    static associate() {
        trx_payments.belongsTo(ctl_type_payments, { foreignKey: 'id_type_payments' })
        // mst_customers.belongsTo(mst_phones_numbers, { foreignKey: 'id_phone_number' })
        trx_payments.belongsToMany(trx_orders, {
            through: rel_order_payment,
            foreignKey: 'id_payment',
            otherKey: 'id_order',
        })
    }
}

trx_payments.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_type_payments: psql.INTEGER,
    // created_by: psql.INTEGER,
    trx_id: psql.STRING,
    card_number: psql.STRING,
    card_holder: psql.STRING,
    card_type: psql.STRING,
    card_cvc: psql.STRING,
    card_exp_date: psql.STRING,
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'trx_payments',
    tableName: 'trx_payments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default trx_payments