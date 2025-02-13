export const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) return "";
    return expiryDate?.toDate
      ? expiryDate.toDate().toISOString().split("T")[0]
      : new Date(expiryDate).toISOString().split("T")[0];
  };
  