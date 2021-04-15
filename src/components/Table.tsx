import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  td,
  th {
    border: 1px solid #ccc;
    padding: 0.25rem;
  }

  tbody > tr:nth-child(odd) > td {
    background-color: #efefef;
  }
`;

export default Table;
