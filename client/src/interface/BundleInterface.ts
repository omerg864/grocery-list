import Item from "./ItemInterface";

interface Bundle {
    _id: string;
    title: string;
    description?: string;
    items: Item[];
    stateUpdated?: Date;
}

export default Bundle;