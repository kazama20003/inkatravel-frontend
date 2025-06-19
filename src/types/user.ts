export type UserRole = "admin" | "user"

export type AuthProvider = "local" | "google" | "facebook"

export interface User {
  _id: string
  fullName: string
  email: string
  password?: string
  role: UserRole
  authProvider: AuthProvider
  phone?: string
  country?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  fullName: string
  email: string
  password?: string
  role?: UserRole
  authProvider?: AuthProvider
  phone?: string
  country?: string
}

export interface UpdateUserDto {
  fullName?: string
  email?: string
  password?: string
  role?: UserRole
  authProvider?: AuthProvider
  phone?: string
  country?: string
}
