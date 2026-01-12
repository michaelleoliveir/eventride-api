export interface CreateEventDTO {
    title: string,
    description: string,
    date: Date,
    address: {
        state: string,
        city: string,
        district: string,
        street: string,
        number: string
    },
    userId: string
}

export interface UpdateEventDTO {
    eventId: string;
    userId: string;
    title?: string;
    description?: string;
    date?: Date;
    address?: {
        state?: string;
        city?: string;
        district?: string;
        street?: string;
        number?: string;
    };
}