// composables/useAuth.ts
export const useAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      const { $api } = useNuxtApp();
      const response = await $api.post("/Auth/Login", {
        email,
        password,
      });

      const { token, role, accountId, shopId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("accountId", accountId);

      if (role.toLowerCase() === "sale" && shopId !== null && shopId !== undefined) {
        localStorage.setItem("shopId", shopId.toString());
      } else {
        localStorage.removeItem("shopId");
      }

      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("accountId");
    localStorage.removeItem("shopId");
    navigateTo("/login");
  };

  return { login, logout };
};
