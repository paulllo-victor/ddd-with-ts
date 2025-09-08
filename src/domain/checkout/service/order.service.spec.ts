import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("order service unit tests", () => {

    it("should place an order", () => {
        const customer = new Customer("c1", "Customer 1");
        const item1 = new OrderItem("i1", "p1", "Item 1", 10, 2);
        const order = OrderService.placeOrder(customer, [item1]);
        expect(customer.rewardPoints).toBe(10);
        expect(order.total()).toBe(20);
    });

    it("should get total of all orders", () => {
        const item1 = new OrderItem("1", "p1", "Item 1", 100, 2);
        const item2 = new OrderItem("2", "p2", "Item 2", 200, 2);
        const order = new Order("1", "c1", [item1]);
        const order2 = new Order("2", "c1", [item2]);
        const orders = [order, order2];
        const total = OrderService.total(orders);
        expect(total).toBe(600);
    });
});