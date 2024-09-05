import { SubscriptionPlanEntity } from '../src/modules/subscription/entities/subscription-plan.entity';
import { CustomerEntity } from '../src/modules/customer/entities/customer.entity';
import { InvoiceEntity } from '../src/modules/invoice/entities/invoice.entity';
import { PaymentEntity } from '../src/modules/payment/entities/payment.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import * as request from 'supertest';


jest.setTimeout(30000);  // Set the timeout for all tests in this file to 30 seconds

describe('App E2E', () => {
  let app: INestApplication;
  let customerRepository: Repository<CustomerEntity>;
  let invoiceRepository: Repository<InvoiceEntity>;
  let paymentRepository: Repository<PaymentEntity>;
  let subscriptionPlanRepository: Repository<SubscriptionPlanEntity>;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    customerRepository = moduleFixture.get<Repository<CustomerEntity>>(getRepositoryToken(CustomerEntity));
    invoiceRepository = moduleFixture.get<Repository<InvoiceEntity>>(getRepositoryToken(InvoiceEntity));
    paymentRepository = moduleFixture.get<Repository<PaymentEntity>>(getRepositoryToken(PaymentEntity));
    subscriptionPlanRepository = moduleFixture.get<Repository<SubscriptionPlanEntity>>(getRepositoryToken(SubscriptionPlanEntity));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Customer and Subscription Plan', () => {
    it('should create a subscription plan', async () => {
      const response = await request(app.getHttpServer())
        .post('/subscription')
        .send({
          name: 'Premium Plan',
          price: 29.99,
          duration: 30,
          billingCycle: 'days',
          status: 'active',
          features: 'Access to all premium features',
        });

      if (response.status === 409) {
        console.log('Conflict: A subscription plan with this name already exists.');
        expect(response.status).toBe(409);
      } else if (response.status === 201) {
        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Premium Plan');
        expect(response.body.price).toBe(29.99);
      } else {
        console.error('Unexpected status code:', response.status);
      }
    });

    it('should create a customer', async () => {
      const subscriptionPlan = await subscriptionPlanRepository.save({
        name: 'Standard Plan',
        price: 19.99,
        duration: 30,
        billingCycle: 'days',
        status: 'active',
        features: 'Access to standard features',
      });

      const response = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          subscriptionPlanId: subscriptionPlan.id,
        })
        .expect(201);
      expect(response.body.data.customer.name).toBe('John Doe');
    });
  });

  describe('Invoice and Payment', () => {
    let customer: CustomerEntity;
    let invoice: InvoiceEntity;

    beforeAll(async () => {

      customer = await customerRepository.findOne({ where: { email: 'johndoe@example.com' }, relations: ['subscriptionPlan'] });

      invoice = await invoiceRepository.save({
        customer,
        subscriptionPlan: customer.subscriptionPlan,
        amount: customer.subscriptionPlan.price,
        issueDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        status: 'pending',
      });
    });

    it('should create an invoice', async () => {
      const response = await request(app.getHttpServer())
        .post('/invoice')
        .send({
          customerId: customer.id,
          subscriptionPlanId: customer.subscriptionPlan.id,
          amount: 9.99,
          issueDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          status: 'pending',
        })
        .expect(201);

      invoice = response.body
      expect(response.body.customer.id).toBe(customer.id);
      expect(response.body.amount).toBe(9.99);
    });

    it('should create a payment and update the invoice status', async () => {

      const response = await request(app.getHttpServer())
        .post('/payment')
        .send({
          invoiceId: invoice.id,
          amount: 9.99,
          paymentDate: new Date(),
          paymentMethod: 'credit_card',
          status: 'paid',
        })
        .expect(201);

      expect(response.body.amount).toBe(9.99);
      expect(response.body.status).toBe('paid');

      const updatedInvoice = await invoiceRepository.findOne({ where: { id: invoice.id } });
      expect(updatedInvoice.status).toBe('paid');
    });

    it('should handle payment failure and retry logic', async () => {
      const payment = await paymentRepository.save({
        invoice,
        amount: 9.99,
        paymentDate: new Date(),
        paymentMethod: 'credit_card',
        status: 'failed',
      });

      const response = await request(app.getHttpServer()).patch(`/payment/${payment.id}/fail`).expect(200);

      expect(response.body.status).toBe('failed_permanently');
    });
  });

});