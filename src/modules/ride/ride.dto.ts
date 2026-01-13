export interface CreateRideDTO {
    eventId: string,
    totalSeats: number,
    date: Date;

    originAddress: {
        state: string,
        city: string,
        district: string,
        street: string,
        number: string
    };

    destinationAddress: {
        state: string,
        city: string,
        district: string,
        street: string,
        number: string
    };

    userId: string
}