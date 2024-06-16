const createEmailTemplate = ({
  nameUser,
  loanApplicationId,
}: {
  nameUser: string;
  loanApplicationId: string;
}): string => {
  const emailTemplate = `
        <div style="background-color: #f8f9fa; padding: 20px;">
          <h2 style="color: #6c757d;">Hola ${nameUser},</h2>
          <p>Tu solicitud de préstamo ${loanApplicationId} fue exitosamente revisada y aceptada por nuestro equipo de selección.</p>
          <p>¡Felicidades!</p>
        </div>
      `;
  return emailTemplate;
};

export default createEmailTemplate;
