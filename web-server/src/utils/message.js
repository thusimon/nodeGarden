const generateMessage = (text, type) => {
  return {
    text,
    type,
    createdAt: new Date().getTime()
  };
};

module.exports = {
  generateMessage
};
