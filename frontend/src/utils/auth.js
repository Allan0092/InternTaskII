const storeToken = (token) => {
  localStorage.setItem("token", token);
};

const getToken = () => {
  return localStorage.getItem("token");
};

const isAdmin = () => {
  return localStorage.getItem("role") === "ADMIN";
};

const storeRole = (role) => {
  localStorage.setItem("role", role);
};

const logout = () => {
  localStorage.clear();
};

const isLoggedIn = () => {
  return (
    localStorage.getItem("token") !== null ||
    localStorage.getItem("role") !== null
  );
};

const setCurrentName = (name) => {
  localStorage.setItem("name", name);
};

const getCurrentName = () => {
  return localStorage.getItem("name");
};

export {
  getCurrentName,
  getToken,
  isAdmin,
  isLoggedIn,
  logout,
  setCurrentName,
  storeRole,
  storeToken,
};
