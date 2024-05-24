import {create} from 'zustand';
import {persist} from "zustand/middleware";
import {useMutation} from "@apollo/client";

export const useProjectStore = create(((set, get) => ({

    project: {
        id: 0,
        number: "ОПЗ–24–7–2–1–1–2",
        name: "а",
        type_project_document_name: "Отчёт с подсчетом запасов россыпного золота (стадия доразведки)",
        type_project_document_id: "6",
        organization_customer_name: "Старица",
        organization_customer_id: "7",
        delegates_id: [
            3
        ],
        facility_id: [
            [
                [
                    2,
                    2
                ],
                [
                    6,
                    1
                ],
                [
                    25,
                    1
                ],
                [
                    89,
                    2
                ]
            ]
        ],
        date_signing: "2024-05-07T17:00:00.000Z",
        duration: 31,
        date_end: "2024-05-13T17:00:00.000Z",
        date_create: "2024-05-15T17:00:00.000Z",
        status_id: "3",
        price: 34314,
        prepayment: 41
    },
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
        set({irds: newIrds});
        console.log("newIrds", newIrds)
    },
    updateStages: (newStages) => {
        set({stages: newStages});
        console.log("newStages", newStages)
    },


})));