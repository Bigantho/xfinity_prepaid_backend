import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { mst_users, mst_customers } from './index.mjs'
class mst_credit_cards extends psql.Model {
    static associate() {
        mst_credit_cards.belongsTo(mst_customers, { foreignKey: 'id_customer' })
        // mst_customers.belongsTo(mst_phones_numbers, { foreignKey: 'id_phone_number' })
    }
}

mst_credit_cards.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_customer: psql.INTEGER,
    number: psql.STRING,
    type: psql.ENUM('VISA', 'Master Card', 'American Express'),
    card_holder: psql.STRING,
    cvc: psql.INTEGER,
    exp_date: psql.INTEGER,
    active: psql.BOOLEAN,
    is_deleted: psql.BOOLEAN,
    billing_address_country: psql.STRING,
    billing_address_street: psql.STRING,
    billing_address_street_2: psql.STRING,
    billing_address_house: psql.STRING,
    billing_address_state: psql.STRING,
    billing_address_city: psql.STRING,
    billing_address_zipcode: psql.STRING,
}, {
    sequelize: DB.connection(),
    modelName: 'mst_credit_cards',
    tableName: 'mst_credit_cards',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default mst_credit_cards