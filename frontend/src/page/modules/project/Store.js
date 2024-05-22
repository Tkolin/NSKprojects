import { create } from 'zustand';


export const useProjectStore = create(set => ({
    project: {},


    setProject: project => set({ project }),


}));
