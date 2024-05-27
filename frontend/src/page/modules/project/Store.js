import {create} from 'zustand';
import {persist} from "zustand/middleware";
import {useMutation} from "@apollo/client";

export const useProjectStore = create(((set, get) => ({

    project: {},
    irds: [],
    stages: [],

    step: 0,
    setSteps: (newStep) => {
        set({step: newStep})
    },

    updateProject: (newProject) => {
        set({project: newProject});
        console.log("newProject", newProject)
    },
    updateIrds: (newIrds) => {
        set({irds: newIrds})
        console.log("newProject", newIrds);
    },
    updateStages: (newStages) => {
        set({stages: newStages});
    },


})));