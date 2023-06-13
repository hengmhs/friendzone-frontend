const bearerToken = (token) => {
  const output = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return output;
};

export { bearerToken };
