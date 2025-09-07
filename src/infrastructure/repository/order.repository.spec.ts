import { Sequelize } from "sequelize-typescript";
import CustomerReposity from "./customer.repository";
import Customer from "../../domain/entity/customer";
import CustomerModel from "../db/sequelize/model/customer.model";
import Address from "../../domain/entity/address";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import ProducRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
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
        const customerRepo = new CustomerReposity();
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
    })
})