import {create} from 'zustand';

export const useTasksStore = create(((set, get) => ({

    project: {},
    loading: false,
    step: 0,

    setSteps: (newStep) => {
        set({step: newStep})
    },
    setLoading: (newLoading) => {
        set({step: newLoading})
    },
    setProject: (newProject) => {
        set({project: newProject});
        console.log("newProject", newProject)
    },
    updateTasks: (newTasks) => {
        set({project:{ ...get().project, project_tasks: newTasks}});
        console.log("newTasks", newTasks)
    },


})));