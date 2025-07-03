import { create } from "zustand";


const useUserStore = create((set) => ({

    user: null,

    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, token: null, isAutheticated: false })


}))
export default useUserStore