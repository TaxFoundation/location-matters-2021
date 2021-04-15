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
  padding: 0.4rem;
`;

const Caveat = styled.div`
  color: #666;
  font-size: 11px;
  font-style: italic;
  padding: 0.25rem 0;
  text-align: center;
`;

const Legend = (): JSX.Element => {
  return (
    <>
      <StyledLegend>
        <TaxType style={{ border: `5px solid ${taxTypes.i.color}` }}>
          {taxTypes.i.name}
        </TaxType>
        <TaxType style={{ border: `5px solid ${taxTypes.p.color}` }}>
          {taxTypes.p.name}
        </TaxType>
        <TaxType style={{ border: `5px solid ${taxTypes.s.color}` }}>
          {taxTypes.s.name}
        </TaxType>
        <TaxType style={{ border: `5px solid ${taxTypes.ui.color}` }}>
          {taxTypes.ui.name}
        </TaxType>
        <TaxType style={{ border: `5px solid ${taxTypes.t.color}` }}>
          {taxTypes.t.name}*
        </TaxType>
      </StyledLegend>
      <Caveat>
        *Indicates that tax type breakdowns are unavailable due to negative
        effective tax rates for one or more tax types.
      </Caveat>
    </>
  );
};

export default Legend;
