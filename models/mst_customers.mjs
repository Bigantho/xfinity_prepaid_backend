import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { mst_credit_cards, mst_users, mst_virtual_phones_numbers, trx_orders } from './index.mjs'
class mst_customers extends psql.Model {
    static associate() {
        mst_customers.belongsTo(mst_users, { foreignKey: 'created_by' })
        mst_customers.belongsTo(mst_virtual_phones_numbers, { foreignKey: 'id_virtual_phone_number' })
        mst_customers.hasMany(trx_orders, { foreignKey: 'id_customer' })
        mst_customers.hasOne(mst_credit_cards, { foreignKey: 'id_customer' })
    }
}

mst_customers.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_virtual_phone_number: psql.INTEGER,
    name: psql.STRING,
    last_name: psql.STRING,
    gender: psql.ENUM('Male', 'Female', 'Other'),
    address_country: psql.STRING,
    address_street: psql.STRING,
    address_street_2: psql.STRING,
    address_house: psql.STRING,
    address_state: psql.STRING,
    address_city: psql.STRING,
    address_zipcode: psql.STRING,
    created_by: psql.INTEGER,
    birthday: psql.STRING,
    phone_number: psql.STRING,
    home_phone: psql.STRING,
    email: psql.STRING,
    active: psql.BOOLEAN,
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'mst_customers',
    tableName: 'mst_customers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default mst_customers