import styled from 'styled-components';

const Text = styled.text`
  font-family: 'Lato', sans-serif;
  font-size: ${props => (props.fontSize ? props.fontSize : '10px')};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 300)};
  stroke: ${props => (props.stroke ? props.stroke : 'currentColor')};
  text-anchor: ${props => (props.textAnchor ? props.textAnchor : 'middle')};
  transform: ${props => (props.transform ? props.transform : 'translate(0,0)')};
`;

export default Text;
