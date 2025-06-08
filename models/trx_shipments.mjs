import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { mst_users, mst_routers, rel_shipment_order, trx_orders } from './index.mjs'
class trx_shipments extends psql.Model {
    static associate() {
        // trx_shipments.belongsTo(mst_routers, { foreignKey: 'id_router' })
        // mst_customers.belongsTo(mst_phones_numbers, { foreignKey: 'id_phone_number' })
        // trx_shipments.hasMany(rel_shipment_order, { foreignKey: 'id_shipment'})
        trx_shipments.belongsToMany(trx_orders, { 
            through: rel_shipment_order,
            foreignKey: 'id_shipment',
            otherKey: 'id_order',
        })
    }
}

trx_shipments.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    created_by: psql.INTEGER,
    // id_router: psql.INTEGER, 
    address_to_delivered: psql.STRING,
    shipping_carrier: psql.STRING,
    tracking_number: psql.STRING,
    active: psql.BOOLEAN, 
    status: psql.STRING,
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'trx_shipments',
    tableName: 'trx_shipments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default trx_shipments