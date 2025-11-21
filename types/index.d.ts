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
  resume: Document
}

declare type UserParams = {
  clerkId: string
  email: string
  username: string
  firstName: string;
  lastName: string;
  age: number;
  skill: string;
  resume: Document;
  createdAt: Date
  updatedAt: Date
}