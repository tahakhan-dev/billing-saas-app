import { SubscriptionPlanEntity } from "src/modules/subscription/entities/subscription-plan.entity";
import { CustomerEntity } from "src/modules/customer/entities/customer.entity";
import { InvoiceEntity } from "src/modules/invoice/entities/invoice.entity";
import { PaymentEntity } from "src/modules/payment/entities/payment.entity";


// database entities
const entitiesList = [
    CustomerEntity, InvoiceEntity, PaymentEntity, SubscriptionPlanEntity
];


export { entitiesList };    