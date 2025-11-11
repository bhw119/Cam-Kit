const parseAdminEmails = () => {
  const { ADMIN_EMAILS = '' } = process.env;
  return ADMIN_EMAILS.split(',').map((email) => email.trim()).filter(Boolean);
};

export const requireAdmin = (req, res, next) => {
  const admins = parseAdminEmails();
  if (!req.user || !admins.includes(req.user.email)) {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }

  return next();
};

