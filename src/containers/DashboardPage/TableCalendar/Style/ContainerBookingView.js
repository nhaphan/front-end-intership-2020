import styled from 'styled-components';
import { WIDTH_CELL_IN_TABLE_CALENDAR } from '../../../App/constant';
const ContainerBookingView = styled.div`
  overflow-x: hidden;
  margin: 0px;
  position: relative;
  padding-bottom: 0px;
  width: ${props => `${props.numberOfDay * WIDTH_CELL_IN_TABLE_CALENDAR}px`};
  grid-template-columns: repeat(
    ${props => props.numberOfDays},
    ${() => `${WIDTH_CELL_IN_TABLE_CALENDAR}px`}
  );
  position: relative;
  z-index: 2;
  height: ${props => `${props.height - 200}px`};
`;
export default ContainerBookingView;