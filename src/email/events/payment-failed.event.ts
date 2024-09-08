export class PaymentFailedEvent {
    constructor(
        public readonly customerEmail: string,
        public readonly paymentId: number,
        public readonly invoiceId: number,
        public readonly amount: number,
    ) { }
}