import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "../Home/styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';
import { createContext, useState } from "react";
import { NewCyleForm } from "./components/NewCycleForm";

import { Countdown } from "./components/Countdown";

/**
 * Contexto: Utilizar quando há muitas propriedades a serem passadas
 * Sempre dar preferência ao props
 */

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
    amountSecondsPassed: number;
    setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

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
    const newcCycleFormSchema = zod.object({
        task: zod.string().min(1, 'Informe a tarefa'),
        minutesAmount: zod.number().min(1, 'O ciclo precisa ser de no mínimo 1 minuto.').max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
    })
    type NewCycleFormData = zod.infer<typeof newcCycleFormSchema>;
    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newcCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });
    const { handleSubmit, watch, reset } = newCycleForm;

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

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds);
    }

    const task = watch('task')
    const isSubmitDisabled = !task;
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed }}>
                <FormProvider {...newCycleForm}>
                    <NewCyleForm />
                </FormProvider>
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