import Item from "./ItemInterface";

interface Bundle {
    id: string;
    title: string;
    description?: string;
    items: Item[];
}

export default Bundle;