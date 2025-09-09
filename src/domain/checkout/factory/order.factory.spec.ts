import OrderFactory from "./order.factory";

describe("Order factory unit test", () => {
    it("should create an order", () => {
        const orderProps = {
            id: "123",
            customerId: "123",
            items: [
                {
                    id: "123",
                    name: "item 1",
                    productId: "123",
                    quantity: 1,
                    price: 10
                }
            ]
        };

        const order = OrderFactory.create(orderProps)

        expect(order.id).toEqual(orderProps.id)
        expect(order.customerId).toEqual(orderProps.customerId)
        expect(order.items.length).toBe(1)
    })
})