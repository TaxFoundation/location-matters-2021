import React from 'react';
import styled from 'styled-components';

const states: string[] = ['Alabama', 'Alaska'];

const Container = styled.div`
  background-color: #0094ff;
  border: 1px solid #0094ff;
  border-radius: 4px;
  color: #fff;
  display: grid;
  grid-gap: 1rem;
  grid-template: repeat(2, 1fr) / auto;
  margin: 0 auto;
  max-width: 800px;
  padding: 1rem;
  text-align: center;
`;

const Heading = styled.h2`
  margin: 0;
`;

const SelectContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  display: grid;
  align-items: center;
  grid-template-areas: 'select';
  &::after {
    background-color: #0094ff;
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    content: '';
    grid-area: select;
    height: 0.5em;
    justify-self: end;
    margin-right: 0.5rem;
    width: 0.8em;
  }
`;

const Select = styled.select`
  appearance: none;
  background-color: transparent;
  cursor: pointer;
  grid-area: select;
  font-size: 1rem;
  text-align: center;
  width: 100%;
  z-index: 1;
`;

interface ISelectProps {
  value: string;
  setValue: (value: string) => void;
}

const StateSelect = ({ value, setValue }: ISelectProps): JSX.Element => {
  return (
    <Container>
      <Heading>Choose a State</Heading>
      <SelectContainer>
        <Select
          name="option-select"
          id="option-select"
          value={value}
          onChange={e => setValue(e.target.value)}
        >
          {states
            // .sort((a, b) => a.id - b.id)
            .map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
        </Select>
      </SelectContainer>
    </Container>
  );
};

export default StateSelect;