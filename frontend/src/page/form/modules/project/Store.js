import {create} from 'zustand'
import {persist} from "zustand/middleware";

export const useProjectStore = create( (set) => ({
    project: {},

}) )