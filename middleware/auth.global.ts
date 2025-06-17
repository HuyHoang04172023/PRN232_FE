// middleware/auth.global.ts

export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token && to.path !== "/login") {
    return navigateTo("/login");
  }

  if (to.path.startsWith("/admin") && role !== "admin") {
    return navigateTo("/login");
  }

  if (to.path.startsWith("/manager") && role !== "manager") {
    return navigateTo("/manager");
  }

  if (to.path.startsWith("/sale") && role !== "sale") {
    return navigateTo("/sale");
  }

  if (to.path.startsWith("/user") && role !== "user") {
    return navigateTo("/user");
  }
});
