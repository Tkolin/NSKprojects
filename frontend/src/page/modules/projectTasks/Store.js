import {create} from 'zustand';
import {persist} from "zustand/middleware";
import {useMutation} from "@apollo/client";

export const useTasksStore = create(((set, get) => ({

    project: {},
    tasks: {
        "gData": [
            {
                "title": "Горные работы",
                "key": "8",
                "disableCheckbox": true,
                "children": [
                    {
                        "title": "МЕТОДИКА ГЕОЛОГОРАЗВЕДОЧНЫХ РАБОТ",
                        "key": "5",
                        "disableCheckbox": true
                    }
                ]
            },
            {
                "title": "Геологическая изученность района",
                "key": "1",
                "disableCheckbox": false
            }
        ],
        "checkedKeys": {
            "2": [
                "8",
                "5"
            ],
            "3": [
                "1"
            ]
        }
    },

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