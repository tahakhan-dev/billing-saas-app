import { CustomerEntity } from "src/modules/customer/entities/customer.entity";
import { InvoiceEntity } from "src/modules/invoice/entities/invoice.entity";
import { NotificationEntity } from "src/modules/notification/entities/notification.entity";
import { PaymentEntity } from "src/modules/payment/entities/payment.entity";
import { SubscriptionPlanEntity } from "src/modules/subscription/entities/subscription-plan.entity";


// database entities
const entitiesList = [
    CustomerEntity, InvoiceEntity, NotificationEntity, PaymentEntity, SubscriptionPlanEntity
];


export { entitiesList };    