const DateToPretty = (dateString: string, hour: boolean): string => {
  if (!hour) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", options);
};

export default DateToPretty;
