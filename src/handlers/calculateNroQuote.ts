export const CalculateQuote = (values: string[]): number => {
  // Verifica si el arreglo está vacío o si el último elemento es "0"
  if (values.length === 0 || values[values.length - 1] === "0") {
    return 1;
  } else {
    // Toma el último elemento del arreglo, lo convierte a número y le suma 1
    const lastNumber = parseInt(values[values.length - 1]);
    return isNaN(lastNumber) ? 1 : lastNumber + 1;
  }
};
