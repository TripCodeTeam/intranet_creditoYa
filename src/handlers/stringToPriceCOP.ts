export const stringToPriceCOP = (price: string) => {
    const number = parseFloat(price);

    const formatter = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formattedNumber = formatter.format(number);
    return formattedNumber;
};