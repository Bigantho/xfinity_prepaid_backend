import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { mst_users, trx_orders, trx_shipments, ctl_statuses_routers } from './index.mjs'
class mst_routers extends psql.Model {
    static associate() {
        mst_routers.hasMany(trx_orders, { foreignKey: 'id_router' })
        mst_routers.belongsTo(ctl_statuses_routers, { foreignKey: 'id_statuses_routers' })
    }
}

mst_routers.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_statuses_routers: psql.INTEGER,
    mac_address: psql.STRING,
    name: psql.STRING,
    correlative: psql.STRING,
    serial: psql.STRING,
    brand: psql.STRING,
    model: psql.STRING,
    year: psql.INTEGER,
    active: psql.BOOLEAN,
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'mst_routers',
    tableName: 'mst_routers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default mst_routers