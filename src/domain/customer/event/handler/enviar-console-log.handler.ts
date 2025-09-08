import EventHandlerInterface from "../../../@shared/event.handler.interface";
import CustomerCreatedEvent from "../customer.created.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerCreatedEvent> {
    handler(event: CustomerCreatedEvent): void {
        const id = event.eventData.id;
        const name = event.eventData.name;
        const address = event.eventData.address;

        console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address}`)
    }
}