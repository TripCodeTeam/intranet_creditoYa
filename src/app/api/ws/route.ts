// app/api/ws/route.ts
import { NextRequest } from 'next/server';
import LoanApplicationService from "@/classes/LoanServices";
import { EventWs, reqChangeState } from "@/types/ws";
import axios from "axios";

// Configure the runtime to use Edge
export const runtime = 'edge';

// WebSocket handler for the Edge runtime
export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const connectSocket = new WebSocket("ws://localhost"); // Replace with your WebSocket server URL
  const response = new Response(readable, { headers: { "Content-Type": "text/event-stream" } });

  connectSocket.addEventListener('open', () => {
    console.log("A client connected!");
  });

  connectSocket.addEventListener('message', async (event) => {
    try {
      console.log("Received message");
      const base64Dates = event.data.toString();
      const parsedEvent: EventWs = JSON.parse(base64Dates);
      console.log(parsedEvent);

      // Handle different event types
      if (parsedEvent.type === "new_loan") {
        console.log(parsedEvent.owner);

        // Since we can't access all clients directly in Edge functions,
        // you'll need to implement a broadcast system, possibly using a database
        // or a service like Redis/PubSub

        // This is where you would broadcast to other clients
        // For now, just send a confirmation back to the sender
        connectSocket.send(
          JSON.stringify({
            type: "confirmation",
            message: "Loan application received",
            data: parsedEvent.owner
          })
        );
      }
      else if (parsedEvent.type === "changeState") {
        const { userId, employeeId, reason, loanApplicationId, state } =
          parsedEvent.data as reqChangeState;

        const dataEventAccept = {
          name: "Solicitud de prestamo",
          userId,
          employeeId,
        };

        const dataEventRejected = {
          name: "Solicitud de prestamo",
          userId,
          reason,
          employeeId,
        };

        try {
          // You'll need to adapt these service calls for the Edge runtime
          // or make API calls to internal endpoints that handle these operations
          await LoanApplicationService.changeStatus(loanApplicationId, state);
          await LoanApplicationService.fillEmployeeId(loanApplicationId, employeeId);

          // Send appropriate response based on state
          if (state === "Aprobado") {
            connectSocket.send(
              JSON.stringify({
                type: "newEventReqLoans",
                data: dataEventAccept,
              })
            );
          } else if (state === "Aplazado") {
            connectSocket.send(
              JSON.stringify({
                type: "newEventReqLoans",
                data: dataEventRejected,
              })
            );
          }
        } catch (error) {
          console.error("Error processing changeState:", error);
          connectSocket.send(JSON.stringify({
            type: "error",
            message: "Failed to process state change"
          }));
        }
      }
      // Handle other event types similarly...
      else if (parsedEvent.type === "createSession") {
        try {
          const id = parsedEvent.data as string;

          // You'll need to adapt this for Edge runtime
          // For example, by using fetch instead of axios
          const response = await fetch("/api/whatsapp/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              // Socket reference can't be sent - use a session ID or token instead
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create session");
          }

          connectSocket.send(
            JSON.stringify({
              type: "sessionCreated",
              id
            })
          );
        } catch (error) {
          console.error("Error creating session:", error);
          connectSocket.send(JSON.stringify({
            type: "error",
            message: "Failed to create session"
          }));
        }
      }
      else if (parsedEvent.type === "newApprove") {
        // Handle newApprove event
        // Again, you'll need a broadcasting mechanism
        connectSocket.send(
          JSON.stringify({
            type: "confirmation",
            message: "Approval received",
            for: parsedEvent.from,
            by: parsedEvent.owner,
          })
        );
      }
    } catch (error) {
      console.error("Error processing message:", error);
      connectSocket.send(JSON.stringify({
        type: "error",
        message: "Failed to process message"
      }));
    }
  });

  connectSocket.addEventListener('close', () => {
    console.log("A client disconnected!");
  });

  connectSocket.addEventListener('error', (error) => {
    console.error("WebSocket error:", error);
  });

  return response;
}

// This is a TypeScript declaration needed for Edge WebSockets
interface WebSocketPair {
  0: WebSocket;
  1: WebSocket;
  socket: WebSocket;
  response: Response;
}