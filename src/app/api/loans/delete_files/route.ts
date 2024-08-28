import LoanApplicationService from "@/classes/LoanServices";
import TokenService from "@/classes/TokenServices";
import { DeleteFileGcs } from "@/lib/storage";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Verificar la autenticación JWT
    const authorizationHeader = req.headers.get("Authorization");

    if (!authorizationHeader) {
      throw new Error("Token de autorización no proporcionado");
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    ); // Reemplaza "tu-clave-secreta" con tu clave secreta

    if (!decodedToken) {
      throw new Error("Token no válido");
    }

    const { upId, userId, loanId, type, mail, authToken } = await req.json();

    const removeRes = await DeleteFileGcs({ type, userId, upId });

    // console.log(type);

    // console.log(removeRes);

    if (type == "labor_card") {
      if (removeRes.success == true) {
        await LoanApplicationService.update(loanId, {
          labor_card: "No definido",
          upid_labor_card: "No definido",
        });

        // const sendInfo = await axios.post(
        //   "/api/mail/delete_doc",
        //   {
        //     loanId,
        //     mail,
        //   },
        //   { headers: { Authorization: `Bearer ${authToken}` } }
        // );

        // console.log(sendInfo);

        // if (sendInfo.data.success == true) {
        //   return NextResponse.json({
        //     success: true,
        //     data: removeRes.message,
        //   });
        // }

        return NextResponse.json({
          success: true,
          data: removeRes.message,
        });
      } else if (removeRes.success == false) {
        throw new Error(removeRes.message);
      }
    } else if (type == "paid_flyer_01") {
      if (removeRes.success == true) {
        const deleteInDb = await LoanApplicationService.update(loanId, {
          fisrt_flyer: "No definido",
          upid_first_flayer: "No definido",
        });

        console.log(deleteInDb);

        // const sendInfo = await axios.post(
        //   "/api/mail/delete_doc",
        //   {
        //     loanId,
        //     mail,
        //   },
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );

        // console.log(sendInfo);

        // if (sendInfo.data.success == true) {
        //   return NextResponse.json({
        //     success: true,
        //     data: removeRes.message,
        //   });
        // }

        return NextResponse.json({
          success: true,
          data: removeRes.message,
        });
      } else if (removeRes.success == false) {
        throw new Error(removeRes.message);
      }
    } else if (type == "paid_flyer_02") {
      if (removeRes.success == true) {
        const deleteInDb = await LoanApplicationService.update(loanId, {
          second_flyer: "No definido",
          upid_second_flyer: "No definido",
        });

        console.log(deleteInDb);

        // const sendInfo = await axios.post(
        //   "/api/mail/delete_doc",
        //   {
        //     loanId,
        //     mail,
        //   },
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );

        // console.log(sendInfo);

        // if (sendInfo.data.success == true) {
        //   return NextResponse.json({
        //     success: true,
        //     data: removeRes.message,
        //   });
        // }

        return NextResponse.json({
          success: true,
          data: removeRes.message,
        });
      } else if (removeRes.success == false) {
        throw new Error(removeRes.message);
      }
    } else if (type == "paid_flyer_03") {
      if (removeRes.success == true) {
        const deleteInDb = await LoanApplicationService.update(loanId, {
          third_flyer: "No definido",
          upid_third_flayer: "No definido",
        });

        console.log(deleteInDb);

        // const sendInfo = await axios.post(
        //   "/api/mail/delete_doc",
        //   {
        //     loanId,
        //     mail,
        //   },
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );

        // console.log(sendInfo);

        // if (sendInfo.data.success == true) {
        //   return NextResponse.json({
        //     success: true,
        //     data: removeRes.message,
        //   });
        // }

        return NextResponse.json({
          success: true,
          data: removeRes.message,
        });
      } else if (removeRes.success == false) {
        throw new Error(removeRes.message);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
