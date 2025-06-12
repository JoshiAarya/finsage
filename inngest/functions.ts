import { inngest } from "./client";

export const createTransaction = inngest.createFunction(
  { id: "create-transaction" },
  { event: "create/transaction" },
  async ({ event, step }) => {
    
  },
);
