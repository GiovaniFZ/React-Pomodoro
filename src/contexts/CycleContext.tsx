import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { Cycle, CyclesReducer } from "../reducers/cycles/reducer";
import { AddNewCycleAction, InterruptCurrentCycleAction, MarkCurrentCycleAsFinishedAction } from "../reducers/cycles/action";
import { differenceInSeconds } from "date-fns";



// Evitar importação de bibliotecas no context
interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    amountSecondsPassed: number;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);



interface CycleContextProviderProps {
    children: ReactNode
}

export function CycleContextProvider({ children }: CycleContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(CyclesReducer, {
        cycles: [],
        activeCycleId: null
    }, (initialState) => {
        const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');
        if(storedStateAsJSON){
            return JSON.parse(storedStateAsJSON)
        }
        return initialState
    });
    
    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if(activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }
        return 0;
    });
    useEffect(() => {
        const stateJson = JSON.stringify(cyclesState)
        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJson)
    }, [cyclesState])

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {
        dispatch(MarkCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        dispatch(AddNewCycleAction(newCycle))
        //setCycles((state) => [...state, newCycle]);
        setAmountSecondsPassed(0);
    }

    function interruptCurrentCycle() {
        dispatch(InterruptCurrentCycleAction())
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}>
            {children}
        </CyclesContext.Provider>
    )
}