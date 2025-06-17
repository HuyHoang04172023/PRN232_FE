// composables/useAuth.ts
export const useAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      const { $api } = useNuxtApp();
      const response = await $api.post("/Auth/Login", {
        email,
        password,
      });

      const { token, role, accountId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("accountId", accountId);

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
    navigateTo("/login");
  };

  return { login, logout };
};
