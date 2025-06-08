import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { trx_shipments, trx_orders } from './index.mjs'
class rel_order_payment extends psql.Model {
    static associate() {
        // rel_shipment_order.belongsTo(trx_orders, { foreignKey: 'id_order' })
        // rel_shipment_order.belongsTo(trx_shipments, { foreignKey: 'id_shipment' })
    }
}

rel_order_payment.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_order: psql.INTEGER,
    id_payment: psql.INTEGER,
    
}, {
    sequelize: DB.connection(),
    modelName: 'rel_order_payment',
    tableName: 'rel_order_payment',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default rel_order_payment