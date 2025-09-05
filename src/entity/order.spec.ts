import Order from "./order";
import OrderItem from "./order_item";
describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      new Order("", "123", []);
    }).toThrow("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      new Order("123", "", []);
    }).toThrow("CustomerId is required");
  });
  it("should throw error when items is empty", () => {
    expect(() => {
      new Order("123", "123", []);
    }).toThrow("Items are required");
  });

  it("should calculate total", () => {
    const orderItem1 = new OrderItem("1", "prod1", "item 1", 100, 1);
    const orderItem2 = new OrderItem("2", "prod2", "item 2", 200, 1);
    const orderItem3 = new OrderItem("3", "prod3", "item 3", 200, 2);

    const order = new Order("123", "123", [orderItem1]);
    expect(order.total()).toBe(100);
    const order2 = new Order("1234", "1234", [orderItem1, orderItem2]);
    expect(order2.total()).toBe(300);
    const order3 = new Order("12345", "1234", [orderItem1, orderItem2, orderItem3]);
    expect(order3.total()).toBe(700);

  });

  it("should check if the qte qtd is greater than 0", () => {
    expect(() => {
      const orderItem1 = new OrderItem("1", "prod1", "item 1", 100, 0);
      const order = new Order("123", "123", [orderItem1]);
    }).toThrow("Quantity must be greater than zero");
  });
});
