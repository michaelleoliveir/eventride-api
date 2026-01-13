export interface CreateUserDTO {
    name: string,
    password: string,
    email: string
};

export interface UpdateUserDTO { 
    userId: string,
    name?: string,
    email?: string
}

export interface UserResponse {
    id: string,
    name: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
}