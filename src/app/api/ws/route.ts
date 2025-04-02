import LoanApplicationService from "@/classes/LoanServices";
import { EventWs, reqChangeState } from "@/types/ws";
import axios from "axios";

// app/api/ws/route.ts (can be any route file in the app directory)
export function SOCKET(
  client: import("ws").WebSocket,
  request: import("http").IncomingMessage,
  server: import("ws").WebSocketServer
) {
  console.log("A client connected!");

  client.on("message", async (payload) => {
    console.log(payload);
    const base64Dates = payload.toString();
    // console.log(base64Dates);
    const event: EventWs = JSON.parse(base64Dates);
    console.log(event);

    if (event.type == "new_loan") {
      console.log(event.owner);

      server.clients.forEach((receiver) => {
        console.log(receiver);
        if (receiver === client) return;

        if (receiver != client && receiver.readyState === receiver.OPEN) {
          receiver.send(
            JSON.stringify({ type: "onNewLoan", data: event.owner })
          );
        }
      });
    } else if (event.type == "changeState") {
      const { userId, employeeId, reason, loanApplicationId, state } =
        event.data as reqChangeState;

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

      await LoanApplicationService.changeStatus(loanApplicationId, state).then(
        (result) => console.log(result)
      );

      await LoanApplicationService.fillEmployeeId(
        loanApplicationId,
        employeeId
      );

      server.clients.forEach((receiver) => {
        console.log(receiver);

        if (receiver === client) return;

        if (state == "Aprobado") {
          receiver.send(
            JSON.stringify({
              type: "newEventReqLoans",
              data: dataEventAccept,
            })
          );
        } else if (state == "Aplazado") {
          receiver.send(
            JSON.stringify({
              type: "newEventReqLoans",
              data: dataEventRejected,
            })
          );
        }
      });
    } else if (event.type == "createSession") {
      try {
        console.log(event);
        const id = event.data as string;
        const socket = client;
        console.log(socket);
        console.log(id);
        await axios.post("/api/whatsapp/session", {
          id,
          socket,
        });
        server.clients.forEach((receiver) => {
          console.log(receiver);
          if (receiver === client) return;
          receiver.send(
            JSON.stringify({ type: "socketForSession", data: { socket } })
          );
        });
      } catch (error) {
        console.log(error);
      }
    } else if (event.type == "newApprove") {
      console.log(event);
      server.clients.forEach((receiver) => {
        console.log(receiver);
        if (receiver === client) return;

        if (receiver != client && receiver.readyState === receiver.OPEN) {
          receiver.send(
            JSON.stringify({
              type: "onNewState",
              for: event.from,
              by: event.owner,
            })
          );
        }
      });
    }
  });

  client.on("close", () => {
    console.log("A client disconnected!");
  });
}
