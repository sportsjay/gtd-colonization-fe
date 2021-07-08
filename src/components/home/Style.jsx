import styled from "styled-components";
import { Container } from "../login/Style";

export const Cont = styled(Container)`
  background-color: white;
  scroll-behavior: smooth;
`;

export const Card = styled(Container)`
  height: max-content;
  width: 80vw;
  justify-content: space-evenly;
  background-color: #f0ffff;
  box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  flex-direction: column;
`;

export const TextCard = styled(Container)`
  height: 20vh;
  width: 40vh;
  flex-direction: column;
  background-color: #f0ffff;
  margin-bottom: -40px;
`;

export const SubCard = styled(Container)`
  height: 30vh;
  width: 50vw;
  background-color: #f0ffff;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

export const SubSubCard = styled(Container)`
  height: 10vh;
  width: 30vw;
  flex-direction: column;
  background-color: #f0ffff;
`;

export const Title = styled.h3`
  text-align: center;
  font-family: "Quicksand", sans-serif;
  font-weight: 1000;
`;

export const Text = styled.p`
  font-family: "Quicksand", sans-serif;
  font-weight: 700;
  text-align: center;
`;
