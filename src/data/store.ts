export interface User {
  id: string;
  name: string;
  walletBalance: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

export const users = new Map<string, User>();


export const transactions = new Map<string, Transaction>();


export const processedTransactions = new Set<string>();

// Seed some users
users.set("user1", {
  id: "user1",
  name: "John Doe",
  walletBalance: 10000,
});

users.set("user2", {
  id: "user2",
  name: "Jane Smith",
  walletBalance: 5000,
});

users.set("user3", {
  id: "user3",
  name: "Alex",
  walletBalance: 7500,
});