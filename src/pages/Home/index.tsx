import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "../Home/styles";
import { NewCyleForm } from "./components/NewCycleForm";
import { createContext, useEffect, useState } from "react";

import { Countdown } from "./components/Countdown";

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    function markCurrentCycleAsFinished(){
        setCycles((state) =>
            state.map(cycle => {
                if(cycle.id === activeCycleId){
                    return {...cycle, finishedDate: new Date()}
                }else{
                    return cycle
                }
            })
        )
    }

    /*
    function handleCreateNewCycle(data: any) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        setCycles((state) => [...state, newCycle]);
        setActiveCycleId(id);
        setAmountSecondsPassed(0);
        reset();
    }
    */

    function handleInterrupt(){
        setCycles(
            (state) => state.map(cycle => {
                if(cycle.id === activeCycleId){
                    return {...cycle, interruptedDate: new Date()}
                }else{
                    return cycle
                }
            })
        )
        setActiveCycleId(null)
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    //const task = watch('task')
    //const isSubmitDisabled = !task;
    return (
        <HomeContainer>
            <form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/ action="">
                <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}>
                {/*<NewCyleForm />*/}
                <Countdown />
                </CyclesContext.Provider>
                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterrupt}>
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                )
                    : (
                        <StartCountdownButton type="submit" /*disabled={isSubmitDisabled}*/>
                            <Play size={24} />
                            Começar
                        </StartCountdownButton>
                    )
                }
            </form>
        </HomeContainer >
    );
}