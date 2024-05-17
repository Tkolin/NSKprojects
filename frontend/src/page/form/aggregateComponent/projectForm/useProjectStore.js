import create from 'zustand';

const useProjectStore = create((set) => ({
    currentStep: 0,
    project: null,
    setCurrentStep: (step) => set({ currentStep: step }),
    setProject: (project) => set({ project }),
}));

export default useProjectStore;
