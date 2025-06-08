import psql from 'sequelize'
import DB from '../config/db.mjs'
import router from '../routes/mainRouter.mjs'
import { trx_orders } from './index.mjs'
class mst_virtual_credit_cards extends psql.Model {
    static associate() {
        mst_virtual_credit_cards.hasMany(trx_orders, { foreignKey: 'id_virtual_credit_cards' })
    }
}

mst_virtual_credit_cards.init({
    id: {
        autoIncrement: true,
        type: psql.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    number: psql.STRING,
    type: psql.ENUM('VISA', 'Master Card', 'American Express'),
    card_holder: psql.STRING,
    cvc: psql.INTEGER,
    exp_date: psql.INTEGER,
    amount_available: psql.FLOAT,
    active: psql.BOOLEAN,
    is_deleted: psql.BOOLEAN
}, {
    sequelize: DB.connection(),
    modelName: 'mst_virtual_credit_cards',
    tableName: 'mst_virtual_credit_cards',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default mst_virtual_credit_cards