
const generateMockStore = (index, ownerId) => {
    return {
        name: `Store${index}`,
        address: `Address${index}`,
        owner: ownerId,
    }
}
const generateMockStores = (ownerIds, quantity) => {
    const stores = [];
    for (let i = 0; i < quantity; i++) {
        const storeId = ownerIds[i % ownerIds.length];
        stores.push(generateMockStore( i + 1, storeId));
    };
    return stores;
}

export default { generateMockStore, generateMockStores };