import Address from "./address";

export default class Customer{
    private _id: string;
    private _name: string
    _address!: Address;
    _active: boolean = true;

    constructor(id: string, name: string){
        this._id = id;
        this._name = name;
        this.validate();
    }

    validate(){
        if(this._id.length === 0){
            throw new Error("Id is required");
        }
        if(this._name.length === 0){
            throw new Error("Name is required");
        }
    }

    get name(): string{
        return this._name;
    }

    changeName(name: string){
        this._name = name;
        this.validate();
    }

    activate(){
        if(this._address === undefined){
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }
    
    deactivate(){
        this._active = false;
    }

    isActive(): boolean{
        return this._active;
    }

    set address(address: Address){
        this._address = address;
    }
}