import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { mst_users } from './index.mjs'
class trx_sessions extends psql.Model {
    static associate() {
        // mst_customers.belongsTo(mst_users, { foreignKey: 'created_by' })
        // mst_customers.belongsTo(mst_phones_numbers, { foreignKey: 'id_phone_number' })
    }
}

trx_sessions.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_user: psql.INTEGER,
    token: psql.TEXT,
    expires_at: psql.DATE
}, {
    sequelize: DB.connection(),
    modelName: 'trx_sessions',
    tableName: 'trx_sessions',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default trx_sessions