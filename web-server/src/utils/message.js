const generateMessage = (name, text, type) => {
  return {
    name,
    text,
    type,
    createdAt: new Date().getTime()
  };
};

module.exports = {
  generateMessage
};
