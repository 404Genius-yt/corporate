declare type CreateUserParams = {
    clerkId: string;
    email: string;
    username: string;
  };

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  age: number;
  skill: string;
}

declare type UserParams = {
  clerkId: string
  email: string
  username: string
  firstName: string;
  lastName: string;
  age: number;
  skill: string;
  createdAt: Date
  updatedAt: Date
}