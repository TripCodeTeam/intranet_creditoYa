// Import statements
import { prisma } from "@/prisma/db";
import { ScalarClient, ScalarDocument } from "@/types/session";
import { Document, Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";

// Class definition
class ClientServices {
  // Create user method
  static async create(data: ScalarClient): Promise<User> {
    const existEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existEmail) {
      throw new Error("El correo electrónico ya está en uso");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        Document: {
          create: {},
        },
      },
    });
  }

  // Get user by ID method
  static async get(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { Document: true },
    });
  }

  // Método para buscar usuarios por nombre completo o número de documento
  static async searchUser(query: string): Promise<User[] | null> {
    try {
      // Separar el query en partes usando espacios
      const queryParts = query.trim().split(" ");

      // Construir condiciones de búsqueda dependiendo de cuántas partes tenga el query
      let searchConditions: Prisma.UserWhereInput[] = [];

      if (queryParts.length === 1) {
        // Si solo hay una parte (e.g., solo el primer nombre)
        searchConditions = [
          {
            names: { contains: queryParts[0], mode: "insensitive" }, // Buscar por nombres
          },
          {
            firstLastName: { contains: queryParts[0], mode: "insensitive" }, // Buscar por primer apellido
          },
          {
            secondLastName: { contains: queryParts[0], mode: "insensitive" }, // Buscar por segundo apellido
          },
        ];
      } else if (queryParts.length === 2) {
        // Si hay dos partes (e.g., nombre y apellido)
        searchConditions = [
          {
            // Buscar por primer nombre y primer apellido
            AND: [
              { names: { contains: queryParts[0], mode: "insensitive" } }, // Primer nombre
              {
                firstLastName: { contains: queryParts[1], mode: "insensitive" },
              }, // Primer apellido
            ],
          },
          {
            // Alternativamente, buscar por nombre y segundo apellido
            AND: [
              { names: { contains: queryParts[0], mode: "insensitive" } }, // Primer nombre
              {
                secondLastName: {
                  contains: queryParts[1],
                  mode: "insensitive",
                },
              }, // Segundo apellido
            ],
          },
        ];
      } else if (queryParts.length >= 3) {
        // Si hay tres o más partes (e.g., dos nombres y un apellido)
        searchConditions = [
          {
            // Buscar por ambos nombres y primer apellido
            AND: [
              {
                names: {
                  contains: `${queryParts[0]} ${queryParts[1]}`,
                  mode: "insensitive",
                },
              }, // Ambos nombres
              {
                firstLastName: { contains: queryParts[2], mode: "insensitive" },
              }, // Primer apellido
            ],
          },
          {
            // Alternativamente, buscar por ambos nombres y segundo apellido
            AND: [
              {
                names: {
                  contains: `${queryParts[0]} ${queryParts[1]}`,
                  mode: "insensitive",
                },
              }, // Ambos nombres
              {
                secondLastName: {
                  contains: queryParts[2],
                  mode: "insensitive",
                },
              }, // Segundo apellido
            ],
          },
        ];
      }

      // Hacer la búsqueda con Prisma
      const users = await prisma.user.findMany({
        where: {
          OR: [
            ...searchConditions,
            {
              // Filtrar también por número de documento si coincide con el query
              Document: {
                some: {
                  number: { contains: query, mode: "insensitive" },
                },
              },
            },
          ],
        },
        include: {
          Document: true, // Incluir los documentos en la respuesta
        },
      });

      return users;
    } catch (error) {
      // if (error instanceof Error) {

      // }
      console.log(error);
      return null;
    }
  }

  // Paginated method to get users
  static async all(
    page: number = 1,
    pageSize: number = 8
  ): Promise<{ users: User[]; totalCount: number }> {
    const skip = (page - 1) * pageSize;
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip: skip,
        take: pageSize,
      }),
      prisma.user.count(), // Cuenta el total de usuarios
    ]);
    return { users, totalCount };
  }

  // Update user method
  static async update(
    id: string,
    data: Omit<ScalarClient, "password" | "Document">
  ): Promise<User> {
    return await prisma.user.update({ where: { id }, data });
  }

  // Update user password method
  static async updatePassword(id: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  // Delete user method
  static async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  // Sign in user method
  static async signin(email: string, password: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Credenciales inválidas");
    }

    return user;
  }

  // Check if user has document data method
  static async hasDocumentData(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Document: true },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Comprueba si el usuario tiene documentos y si los campos son diferentes de "void"
    return user.Document.some(
      (document) =>
        document.documentSides !== "No definido" &&
        document.number !== "No definido"
    );
  }

  // Update user document method
  static async updateDocument(
    userId: string,
    documentSides: string,
    number: string
  ): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Document: true },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Actualiza los documentos del usuario
    const updatedDocuments = user.Document.map((document) =>
      prisma.document.update({
        where: { id: document.id },
        data: {
          documentSides,
          number: number,
        },
      })
    );

    await Promise.all(updatedDocuments);

    return prisma.user.findUnique({
      where: { id: userId },
      include: { Document: true },
    });
  }

  // List user documents method
  static async listDocuments(userId: string): Promise<Document[]> {
    const documents = await prisma.document.findMany({
      where: { userId: userId },
    });

    if (!documents) {
      throw new Error("No se encontraron documentos para este usuario");
    }

    return documents;
  }

  // Método para obtener un documento por userId
  static async getDocumentByUserId(userId: string): Promise<Document | null> {
    const document = await prisma.document.findFirst({
      where: { userId },
    });

    return document;
  }

  // Metodo para cambiar rejectReason de una solicitud
  static async changeReject(loanApplicationId: string, reason: string) {
    return prisma.loanApplication.update({
      where: { id: loanApplicationId },
      data: { reasonReject: reason },
    });
  }

  // Método para obtener id, email y nombres de todos los clientes existentes
  static async getAllClientsInfo(): Promise<
    { id: string; email: string; names: string }[]
  > {
    const clients = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        names: true,
      },
    });

    return clients.map((client) => ({
      id: client.id,
      email: client.email,
      names: client.names,
    }));
  }
}

// Export the UserService class
export default ClientServices;
