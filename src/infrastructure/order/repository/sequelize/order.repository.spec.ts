import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import Address from "../../../../domain/customer/value-object/address";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequilize/product.model";
import ProducRepository from "../../../product/repository/sequilize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });


    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        customer.changeAddress(address);
        await customerRepo.create(customer);

        const productRepository = new ProducRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem("1", product.id, product.name, product.price, 2);

        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: order.id,
                    product_id: product.id
                }
            ]
        })
    });

    it("should update a order", async () => {
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        customer.changeAddress(address);
        await customerRepo.create(customer);

        const productRepository = new ProducRepository();
        const product1 = new Product("123", "Product 1", 10);
        await productRepository.create(product1);

        const ordemItem1 = new OrderItem("1", product1.id, product1.name, product1.price, 2);
        const order = new Order("123", "123", [ordemItem1]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)

        const product2 = new Product("456", "Product 2", 50);
        await productRepository.create(product2);

        const ordemItem2 = new OrderItem("2", product2.id, product2.name, product2.price, 2);
        order.changeItems([ordemItem1, ordemItem2]);
        await orderRepository.update(order)

        const orderDB = await orderRepository.find(order.id)

        expect(order).toStrictEqual(orderDB)
    });

    it("should find a order", async () => {
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        customer.changeAddress(address);
        await customerRepo.create(customer);

        const productRepository = new ProducRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)

        const orderDB = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderDB)
    })

    it("should find all orders", async () => {
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        customer.changeAddress(address);
        await customerRepo.create(customer);

        const productRepository = new ProducRepository();
        const product1 = new Product("123", "Product 1", 10);
        await productRepository.create(product1);
        const product2 = new Product("456", "Product 2", 50);
        await productRepository.create(product2);
        const product3 = new Product("789", "Product 3", 50);
        await productRepository.create(product3);

        const ordemItem1 = new OrderItem("1", product1.id, product1.name, product1.price, 2);
        const order1 = new Order("123", "123", [ordemItem1]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order1)

        const ordemItem2 = new OrderItem("1123", product2.id, product2.name, product2.price, 2);
        const ordemItem3 = new OrderItem("2", product3.id, product3.name, product3.price, 2);
        const order2 = new Order("12345", "123", [ordemItem2, ordemItem3]);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toStrictEqual([order1, order2])
    })
})