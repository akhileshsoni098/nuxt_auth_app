import type { IUser } from "~~/server/models/User";
import type { ApiResponse } from "~~/server/types";

export const useAuth = () => {
  // ==== login=====

  const token = useCookie("token");

  const login = async (email: string, password: string) => {
    const response = await $fetch<ApiResponse<IUser>>("/api/login", {
      method: "POST",
      body: {
        email,
        password,
      },
    });

    if (response.token) {
      token.value = response.token;
    }
    return response;
  };

  //=========== register =====

  const register = async (
    name: string,
    email: string,
    password: string,
    age: number,
    is_married: boolean,
  ) => {
    const response = await $fetch<ApiResponse<IUser>>("/api/register", {
      method: "POST",
      body: {
        name,
        email,
        password,
        age,
        is_married,
      },
    });

    return response;
  };
  //=========== Logout =====
  const logout = () => {
    token.value = null;
    navigateTo("/login");
  };
  // === profile fetch ===
  const fetchProfile = async (): Promise<ApiResponse<IUser> | null> => {
    try {
      return await $fetch<ApiResponse<IUser>>("/api/profile", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  return {
    token,
    login,
    register,
    logout,
    fetchProfile,
  };
};
