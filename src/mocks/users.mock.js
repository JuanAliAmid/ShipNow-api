import { USER_ROLES } from "../constants/constants.js";

const generateMockUser = (index, role = USER_ROLES.USER) => {
    return {
        firstName: `Usuario${index}`,
        lastName: `Demo${index}`,
        email: `user${index}@test.com`,
        password: 'coder123',
        role
    }
}

const generateMockUserQuantity = (quantity) => {
    return Array.from({ length: quantity }, (_, index) => generateMockUser(index + 1));
}

const generateMockDrivers = (quantity) => {
    return Array.from({ length: quantity }, (_, index) => ({
        firstName: `Driver${index +1}`,
        lastName: `Demo${index +1}`,
        email: `driver${index +1}@test.com`,
        password: 'coder123',
        role: USER_ROLES.DRIVER,
        isAvailable: true
    }));

}

export default {
    generateMockUser,
    generateMockUserQuantity,
    generateMockDrivers
}