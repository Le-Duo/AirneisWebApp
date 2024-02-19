export interface ShippingAddress {
    _id?: string;
    user: string;
    firstName: string;
    lastName: string;
    street: string;
    street2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
}
