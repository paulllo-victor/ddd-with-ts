import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "./customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerModel from "./customer.model";
import Address from "../../../../domain/customer/value-object/address";

describe("Customer repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });


    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a Customer", async () => {
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        customer.changeAddress(address);
        await customerRepo.create(customer);

        const customerDb = await CustomerModel.findOne({ where: { id: "123" } });
        expect(customerDb?.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.Address.street,
            number: customer.Address.number,
            zip: customer.Address.zip,
            city: customer.Address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints
        });
    });

    it("should update a customer", async () => {
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        customer.changeAddress(address);
        await customerRepo.create(customer);

        customer.changeName("Customer 2");
        await customerRepo.update(customer);

        const customerDb = await CustomerModel.findOne({ where: { id: "123" } });
        expect(customerDb?.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.Address.street,
            number: customer.Address.number,
            zip: customer.Address.zip,
            city: customer.Address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints
        });
    });

    it("should find a Customer", async () => {
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        customer.changeAddress(address);
        await customerRepo.create(customer);

        const customerDb = await customerRepo.find("123");

        expect(customerDb).toStrictEqual(customer);
    });

    it("should throw an error when customer is not found", async () => {
        const customerRepo = new CustomerRepository();

        expect(async () => {
            await customerRepo.find("456ABC");
        }).rejects.toThrow("Customer not found");
    });

    it("should find all Customers", async () => {
        const customerRepo = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 123, "12345-678", "City 1");
        customer1.changeAddress(address1);
        await customerRepo.create(customer1);

        const customer2 = new Customer("456", "Customer 2");
        const address2 = new Address("Street 2", 456, "45678-123", "City 2");
        customer2.changeAddress(address2);
        await customerRepo.create(customer2);

        const customers = await customerRepo.findAll();
        expect(customers).toHaveLength(2);
        expect(customers).toStrictEqual([customer1, customer2]);
    });
})