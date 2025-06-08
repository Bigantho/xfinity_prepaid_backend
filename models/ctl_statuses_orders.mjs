import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import {mst_routers } from './index.mjs'
class ctl_statuses_orders extends psql.Model {
    static associate() {
        ctl_statuses_orders.hasMany(mst_routers, { foreignKey: 'id_statuses_routers'})
    }
}

ctl_statuses_orders.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: psql.STRING,
    active: psql.BOOLEAN, 
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'ctl_statuses_orders',
    tableName: 'ctl_statuses_orders',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default ctl_statuses_orders