import { create } from "zustand";
import userSlice from './slices/user.slice.js';
import adminSlice from './slices/admin.slice.js';
import managerSlice from './slices/manager.slice.js';

// Combine all slices in the store:
const useStore = create((...args) => ({
  ...userSlice(...args),
  ...adminSlice(...args),
  ...managerSlice(...args)
}))


export default useStore;
