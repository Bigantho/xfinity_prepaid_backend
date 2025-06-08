import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { mst_customers, mst_users } from './index.mjs'
class mst_virtual_phones_numbers extends psql.Model {
    static associate() {
        mst_virtual_phones_numbers.hasMany(mst_customers, { foreignKey: 'id_virtual_phone_number' })
        mst_virtual_phones_numbers.belongsTo(mst_users, { foreignKey: 'acquired_by' })
    }
}

mst_virtual_phones_numbers.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    number: psql.STRING,
    acquired_by: psql.STRING,
    active: psql.BOOLEAN,
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'mst_virtual_phones_numbers',
    tableName: 'mst_virtual_phones_numbers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default mst_virtual_phones_numbers