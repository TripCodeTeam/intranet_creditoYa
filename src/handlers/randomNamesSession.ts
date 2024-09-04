export function generateSessionName(): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Genera un número aleatorio de 4 dígitos
  return `CreditoYa${randomNumber}`;
}
