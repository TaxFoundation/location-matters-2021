import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  td,
  th {
    border: 1px solid #ccc;
    padding: 0.5rem;
  }

  tbody > tr:nth-child(odd) > td {
    background-color: #efefef;
  }
`;

const TH = styled.th<{ upColor: string; downColor: string }>`
  background-color: #fff;
  background-clip: padding-box;
  box-shadow: 0 1px 0 0 #ccc;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  position: sticky;
  top: 0;
  text-align: center;
  transition: 0.2s ease-in-out background-color;

  &:hover {
    background-color: var(--tf-blue-light) !important;
  }

  div {
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;

    @media screen and (min-width: 500px) {
      padding-right: 0.5rem;
      position: relative;

      &::after,
      &::before {
        border: 4px solid transparent;
        content: '';
        display: block;
        height: 0;
        right: 0;
        top: 50%;
        position: absolute;
        width: 0;
      }

      &::before {
        border-bottom-color: ${props => props.upColor};
        margin-top: -9px;
      }

      &::after {
        border-top-color: ${props => props.downColor};
        margin-top: 1px;
      }
    }
  }
`;

export { Table as default, TH };
