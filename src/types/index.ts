import type { Post } from "./dummyjson-types";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  image: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  // https://docs.noroff.dev/docs/v2/authentication
  accessToken: string;
  refreshToken: string;
  apiKey: string;
}

export interface AppState {
  posts: Post[];
  auth?: AuthState;
  currentPage?: string;
}

export interface Meta {
  barcode: string;
  createdAt: Date;
  qrCode: string;
  updatedAt: Date;
}

// Create a clean object to send to our service
export interface ErrorReport {
  message: string;
  stack: string;
  timestamp: string;
  url: string;
}

// ## Define our custom error types

export class ValidationError extends Error {
  constructor(message: string) {
    // Call the parent constructor
    super(message);
    // Set the error name to the class name
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}
