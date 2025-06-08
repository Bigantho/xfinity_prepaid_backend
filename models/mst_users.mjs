import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { mst_customers, mst_virtual_phones_numbers, trx_sessions, trx_orders } from './index.mjs'
class mst_users extends psql.Model {
    static associate() {
        mst_users.hasMany(mst_customers, { foreignKey: 'created_by' })
        mst_users.hasMany(mst_virtual_phones_numbers, { foreignKey: 'acquired_by' })
        mst_users.hasMany(trx_sessions, { foreignKey: 'id_user' })
        mst_users.hasMany(trx_orders, { foreignKey: 'created_by' })
    }
}

mst_users.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: psql.STRING,
    last_name: psql.STRING,
    user: psql.STRING,
    email: psql.STRING,
    password: psql.STRING,
    active: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'mst_users',
    tableName: 'mst_users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default mst_users