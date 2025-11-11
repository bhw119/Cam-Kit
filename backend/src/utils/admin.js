export const isAdminUser = (email) => {
  const { ADMIN_EMAILS = '' } = process.env;
  return ADMIN_EMAILS.split(',').map((item) => item.trim()).filter(Boolean).includes(email);
};

