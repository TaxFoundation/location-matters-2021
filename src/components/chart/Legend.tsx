import React from 'react';
import styled from 'styled-components';

import taxTypes from '../../data/tax-types.json';

const StyledLegend = styled.div`
  display: flex;
  justify-content: space-around;
`;

const TaxType = styled.div`
  border-radius: 4px;
  font-size: 14px;
  padding: 0.5rem;
`;

const Legend = (): JSX.Element => {
  return (
    <StyledLegend>
      <TaxType style={{ border: `3px solid ${taxTypes.ui.color}` }}>
        {taxTypes.ui.name}
      </TaxType>
      <TaxType style={{ border: `3px solid ${taxTypes.s.color}` }}>
        {taxTypes.s.name}
      </TaxType>
      <TaxType style={{ border: `3px solid ${taxTypes.p.color}` }}>
        {taxTypes.p.name}
      </TaxType>
      <TaxType style={{ border: `3px solid ${taxTypes.i.color}` }}>
        {taxTypes.i.name}
      </TaxType>
      <TaxType style={{ border: `3px solid ${taxTypes.t.color}` }}>
        {taxTypes.t.name}
      </TaxType>
    </StyledLegend>
  );
};

export default Legend;
