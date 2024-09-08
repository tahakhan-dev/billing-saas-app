export class InvoiceCreatedEvent {
    constructor(
        public readonly customerEmail: string,
        public readonly invoiceId: number,
        public readonly amount: number,
    ) { }
}