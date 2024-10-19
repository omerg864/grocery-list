import Item from "./ItemInterface";

interface Bundle {
    _id: string;
    title: string;
    description?: string;
    items: Item[];
    stateUpdated?: Date;
}

const bundleDefault: Bundle = {
    _id: '',
    title: '',
    items: [],
};

export { bundleDefault };

export default Bundle;