export interface ResourceResponse {
  limit: number;
  skip: number;
  total: number;
}

export interface PostsResponse extends ResourceResponse {
  find(arg0: (p: any) => boolean): unknown;
  data: boolean;
  posts: Post[];
  totalCount: number;
}

export interface Post {
  media: any;
  body: string;
  id: number;
  reactions: Reactions;
  tags: string[];
  title: string;
  userId: number;
  views: number;
}

export interface Reactions {
  dislikes: number;
  likes: number;
}

export interface UserResponse extends ResourceResponse {
  users: User[];
}

export interface User {
  address: Address;
  age: number;
  bank: Bank;
  birthDate: string;
  bloodGroup: string;
  company: Company;
  crypto: Crypto;
  ein: string;
  email: string;
  eyeColor: string;
  firstName: string;
  gender: string;
  hair: Hair;
  height: number;
  id: number;
  image: string;
  ip: string;
  lastName: string;
  macAddress: string;
  maidenName: string;
  password: string;
  phone: string;
  role: string | 'admin' | 'moderator' | 'user';
  ssn: string;
  university: string;
  userAgent: string;
  username: string;
  weight: number;
}

export interface Address {
  address: string;
  city: string;
  coordinates: Coordinates;
  country: string;
  postalCode: string;
  state: string;
  stateCode: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface Company {
  address: Address;
  department: string;
  name: string;
  title: string;
}

export interface Crypto {
  coin: string;
  network: string;
  wallet: string;
}

export interface Hair {
  color: string;
  type: string | 'Curly' | 'Kinky' | 'Straight' | 'Wavy';
}

export interface CommentsResponse extends ResourceResponse {
  comments: Comment[];
  limit: number;
  skip: number;
  total: number;
}

export interface Comment {
  body: string;
  id: number;
  likes: number;
  postId: number;
  user: User;
}

export interface User {
  fullName: string;
  id: number;
  username: string;
}
