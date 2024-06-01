import {create} from 'zustand';
import {persist} from "zustand/middleware";
import {useMutation} from "@apollo/client";

export const useTasksStore = create(((set, get) => ({

    project: {},
    tasks: [],

    step: 0,
    setSteps: (newStep) => {
        set({step: newStep})
    },


    updateProject: (newProject) => {
        set({project: newProject});
        console.log("newProject", newProject)
    },
    updateTasks: (newTasks) => {
        set({irds: newTasks})
        console.log("newTasks", newTasks);
    },



})));