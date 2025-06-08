import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import {  mst_users, trx_orders } from './index.mjs'
class mst_documents extends psql.Model {
    static associate() {
        mst_documents.belongsTo(trx_orders, { foreignKey: 'id_orders' })
        // mst_customers.belongsTo(mst_virtual_phones_numbers, { foreignKey: 'id_virtual_phone_number' })
        // mst_customers.hasMany(trx_orders, { foreignKey: 'id_customer' })
        // mst_customers.hasOne(mst_credit_cards, { foreignKey: 'id_customer' })
    }
}

mst_documents.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_orders: psql.INTEGER,
    uuid: psql.STRING,
    type: psql.STRING,
    size: psql.STRING,
    active: psql.BOOLEAN,
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'mst_documents',
    tableName: 'mst_documents',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default mst_documents