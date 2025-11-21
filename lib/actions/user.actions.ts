"use server"

import { IUser, User } from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function updateUser(clerkId: string, userData: UpdateUserParams) {
  try {
    await connectToDatabase();

    console.log('Searching for user with clerkId:', clerkId);
    console.log('Update data:', userData);

    // Check if user exists first
    const existingUser = await User.findOne({ clerkId });
    console.log('Existing user found:', existingUser ? 'Yes' : 'No');
    
    if (!existingUser) {
      console.log('User not found, available users:', await User.find({}, 'clerkId email username').limit(5));
      throw new Error('User not found');
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { 
        ...userData,
        updatedAt: new Date()
      },
      { new: true }
    );

    console.log('User updated successfully:', updatedUser);
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function getUserById(userId: any) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("getting error in reading user:", error)
    throw error
  }
}