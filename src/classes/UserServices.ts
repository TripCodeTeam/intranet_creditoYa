class UserServices {
  // Create user method
  static async create(data: ScalarUser): Promise<User> {
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
}

export default UserServices;
