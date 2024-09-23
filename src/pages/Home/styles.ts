import styled from "styled-components";

export const HomeContainer = styled.main`
flex: 1;
display: flex;
align-items: center;
justify-content: center;

form{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
}
`

export const BaseCountdownButton = styled.button`
width: 100%;
border-radius: 8px;
border: 0px;
padding: 1rem;
display: flex;
justify-content: center;
align-items: center;
gap: 0.5rem;
font-weight: bold;
cursor: pointer;
&:disabled{
    cursor: not-allowed;
    opacity: 0.7;
}
color: ${(props) => props.theme["gray-100"]};

`

export const StartCountdownButton = styled(BaseCountdownButton)`
background: ${(props) => props.theme['green-500']};
&:not(:disabled):hover{
    background: ${props => props.theme["green-700"]}
}
`

export const StopCountdownButton = styled(BaseCountdownButton)` 
background: ${(props) => props.theme['red-500']};
&:not(:disabled):hover{
    background: ${props => props.theme["red-700"]}
}
`