import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import {trx_payments } from './index.mjs'
class ctl_type_payments extends psql.Model {
    static associate() {
        ctl_type_payments.hasMany(trx_payments, { foreignKey: 'id_type_payments'})
    }
}

ctl_type_payments.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: psql.STRING,
    amount: psql.FLOAT,
    desc: psql.STRING,
    active: psql.BOOLEAN, 
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'ctl_type_payments',
    tableName: 'ctl_type_payments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default ctl_type_payments