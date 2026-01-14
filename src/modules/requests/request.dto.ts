export interface CreateRequestDTO {
    rideId: string,
    userId: string
}

export interface UpdateRequestDTO {
    requestId: string,
    userId: string,
    status: 'ACCEPTED' | 'REJECTED'
}

export interface DeleteRequestDTO {
    requestId: string,
    userId: string,
}