import mst_users from "./mst_users.mjs";
import mst_customers from "./mst_customers.mjs";
import mst_virtual_phones_numbers from "./mst_virtual_phones_numbers.mjs";
import ctl_statuses_orders from "./ctl_statuses_orders.mjs";
import mst_credit_cards from "./mst_credit_cards.mjs"
import trx_orders from "./trx_orders.mjs";
import trx_payments from "./trx_payments.mjs";
import trx_sessions from "./trx_sessions.mjs";
import trx_shipments from "./trx_shipments.mjs"
import mst_virtual_credit_cards from "./mst_virtual_credit_cards.mjs";
import mst_routers from "./mst_routers.mjs";
import rel_shipment_order from "./rel_shipment_order.mjs";
import ctl_type_payments from "./ctl_type_payments.mjs";
import ctl_statuses_routers from "./ctl_statuses_routers.mjs";
import mst_documents from "./mst_documents.mjs";
import rel_order_payment from "./rel_order_payment.mjs";

mst_users.associate()
mst_customers.associate()
mst_virtual_phones_numbers.associate()
ctl_statuses_orders.associate()
mst_credit_cards.associate()
trx_orders.associate()
trx_payments.associate()
trx_sessions.associate()
trx_shipments.associate()
mst_virtual_credit_cards.associate()
mst_routers.associate()
rel_shipment_order.associate()
ctl_type_payments.associate()
ctl_statuses_routers.associate()
mst_documents.associate()
rel_order_payment.associate()
export {
  mst_users,
  mst_customers,
  mst_virtual_phones_numbers,
  ctl_statuses_orders,
  mst_credit_cards,
  trx_orders,
  trx_payments,
  trx_sessions,
  trx_shipments,
  mst_virtual_credit_cards,
  mst_routers,
  rel_shipment_order,
  ctl_type_payments,
  ctl_statuses_routers,
  mst_documents,
  rel_order_payment
} 