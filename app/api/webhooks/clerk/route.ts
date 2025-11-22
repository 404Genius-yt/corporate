import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { User } from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";

export async function POST(req: Request) {
  try {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error("WEBHOOK_SECRET is missing");
      return NextResponse.json(
        { error: "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local" },
        { status: 500 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: "Error occurred -- no svix headers" },
        { status: 400 }
      );
    }

    // Get the body as text first (needed for verification)
    const payload = await req.text();

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return NextResponse.json(
        { error: "Error occurred while verifying webhook" },
        { status: 400 }
      );
    }

    // Get the ID and type
    const eventType = evt.type;

    // CREATE
    if (eventType === "user.created") {
      const { id, email_addresses, username } = evt.data;

      // Validate email_addresses exists and has at least one email
      if (!email_addresses || !Array.isArray(email_addresses) || email_addresses.length === 0) {
        console.error("No email addresses found in webhook data:", evt.data);
        return NextResponse.json(
          { error: "Email address is required but not provided" },
          { status: 400 }
        );
      }

      // Get the first email address
      const email = email_addresses[0]?.email_address;
      if (!email) {
        console.error("Email address is missing:", email_addresses);
        return NextResponse.json(
          { error: "Invalid email address format" },
          { status: 400 }
        );
      }

      // Generate username from email if not provided
      const userUsername = username || email.split("@")[0];

      const user = {
        clerkId: id,
        email: email,
        username: userUsername,
      };

      try {
        const newUser = await User.create(user);
        const client = await clerkClient();

        // Set public metadata
        if (newUser) {
          await client.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser._id.toString(),
            },
          });
        }

        return NextResponse.json({ message: "OK", user: newUser });
      } catch (dbError: any) {
        console.error("Error creating user in database:", dbError);
        
        // Handle duplicate key error
        if (dbError.code === 11000) {
          return NextResponse.json(
            { error: "User already exists" },
            { status: 409 }
          );
        }

        return NextResponse.json(
          { error: "Error creating user", details: dbError.message },
          { status: 500 }
        );
      }
    }

    // Return success for other event types
    return NextResponse.json({ message: "Event received", type: eventType });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}