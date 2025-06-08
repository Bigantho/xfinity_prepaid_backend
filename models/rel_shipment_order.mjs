import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { trx_shipments, trx_orders } from './index.mjs'
class rel_shipment_order extends psql.Model {
    static associate() {
        // rel_shipment_order.belongsTo(trx_orders, { foreignKey: 'id_order' })
        // rel_shipment_order.belongsTo(trx_shipments, { foreignKey: 'id_shipment' })
    }
}

rel_shipment_order.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_shipment: psql.INTEGER,
    id_order: psql.INTEGER,
    active: psql.BOOLEAN,
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'rel_shipment_order',
    tableName: 'rel_shipment_order',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default rel_shipment_order