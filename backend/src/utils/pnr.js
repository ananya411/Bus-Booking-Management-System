/**
 * PNR Generator
 * Generates unique PNR string in the format BUS-YYYY-XXXXXX
 */

const generatePNR = () => {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomPart += chars.charAt(randomIndex);
  }
  return `BUS-${year}-${randomPart}`;
};

module.exports = {
  generatePNR
};
