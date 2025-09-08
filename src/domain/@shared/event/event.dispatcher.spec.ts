import CustomerChangeAddressEvent from "../../customer/event/customer.change-address.event";
import CustomerCreatedEvent from "../../customer/event/customer.created.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/enviar-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/enviar-console-log-2.handler";
import EnviaConsoleLogHandler from "../../customer/event/handler/enviar-console-log.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email.when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product.created.event";
import EventDispatcher from "./event.dispatcher";
import { expect, jest } from '@jest/globals';


describe("Domain events tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    })

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handler")

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0
        })
        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent)

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should notify all event handlers customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerLog1 = new EnviaConsoleLog1Handler();
        const eventHandlerLog2 = new EnviaConsoleLog2Handler();
        const spyEventHandlerLog1 = jest.spyOn(eventHandlerLog1, "handler");
        const spyEventHandlerLog2 = jest.spyOn(eventHandlerLog2, "handler")

        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandlerLog1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandlerLog2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "Customer 1",
            active: true,
            rewardPoints: 0
        })
        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(customerCreatedEvent)

        expect(spyEventHandlerLog1).toHaveBeenCalled();
        expect(spyEventHandlerLog2).toHaveBeenCalled();
    });

    it("should notify all event handlers customer change addres", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handler")

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler);

        const customerChangeAddressEvent = new CustomerChangeAddressEvent({
            id: "123123",
            name: "Paulo Victor",
            address: "Rua do sol, 123"
        })
        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(customerChangeAddressEvent)

        expect(spyEventHandler).toHaveBeenCalled();
    });
})