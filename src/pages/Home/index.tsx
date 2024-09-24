import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "../Home/styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';
import { useContext } from "react";
import { NewCyleForm } from "./components/NewCycleForm";

import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CycleContext";

/**
 * Contexto: Utilizar quando há muitas propriedades a serem passadas
 * Sempre dar preferência ao props
 */

export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext);

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

    const task = watch('task')
    const isSubmitDisabled = !task;
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(createNewCycle)} action="">
                <FormProvider {...newCycleForm}>
                    <NewCyleForm />
                </FormProvider>
                <Countdown />
                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle}>
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                )
                    : (
                        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
                            <Play size={24} />
                            Começar
                        </StartCountdownButton>
                    )
                }
            </form>
        </HomeContainer >
    );
}