import React, { useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import useScrollOnDrag from 'react-scroll-ondrag';

import { getNumberOfDay } from '../../utils/Date';
import { useWindowSize } from '../../utils/Window';

import Booking from './TableCalendar/Booking';
import ContainerBookingView from './TableCalendar/Style/ContainerBookingView';
import RowBookingView from './TableCalendar/Style/RowBookingView';
import ContentBooking from './TableCalendar/ContentBooking';
import DateBooking from './TableCalendar/Style/DateBooking';
import HeaderCalendar from './TableCalendar/HeaderCalendar';

import Sidebar from './ResourceBar/Sidebar';
import { CalendarContext } from '../../context/Calendar';
import Container from './TableCalendar/Style/Container';

function TableCalendar({ startDay, endDay }) {
  const [size] = useWindowSize();
  const ref = useRef();
  const { events } = useScrollOnDrag(ref);
  const calendarContext = useContext(CalendarContext);
  const {
    searchResult,
    getMaxTotalOverlapBooking,
    getBookingWithResource,
  } = calendarContext;

  const numberOfDay = getNumberOfDay(startDay, endDay);

  function renderBooking(date, indexResource) {
    const bookingWithResource = getBookingWithResource(date, indexResource);

    const bookingDateWithResourceRender = bookingWithResource.map(
      (booking, index) => (
        <Booking
          // eslint-disable-next-line no-underscore-dangle
          key={booking._id}
          color="green"
          isFirst={index === 0}
          isDuration
          booking={booking}
        ></Booking>
      ),
    );
    return bookingDateWithResourceRender;
  }
  const renderCellsInCalendar = indexResource => {
    const days = new Array(numberOfDay).fill(1).map((item, i) => {
      const dateInCell = moment(startDay.toString()).add(i, 'days');
      console.log(`day in cell: ${dateInCell}`);
      const bookingDateWithResource = renderBooking(dateInCell, indexResource);
      const weekDayName = dateInCell.format('ddd');
      const isWeekend = weekDayName === 'Sun' || weekDayName === 'Sat';

      return (
        <ContentBooking
          isWeekend={isWeekend}
          key={`${dateInCell} ${indexResource}`}
        >
          {bookingDateWithResource}
        </ContentBooking>
      );
    });
    return days;
  };

  const renderRowsInCalendar = resources => {
    const renderCells = new Array(resources.length)
      .fill(1)
      .map((cell, indexResource) => {
        const days = renderCellsInCalendar(indexResource);
        return (
          <RowBookingView
            // eslint-disable-next-line no-underscore-dangle
            key={searchResult[indexResource]._id}
            overlapBooking={getMaxTotalOverlapBooking(indexResource)}
          >
            {days}
          </RowBookingView>
        );
      });
    return renderCells;
  };

  useEffect(() => () => {}, []);
  return (
    <Container width={size.width} height={size.height}>
      <Sidebar getMaxTotalOverlapBooking={getMaxTotalOverlapBooking}></Sidebar>
      <DateBooking ref={ref} {...events}>
        <HeaderCalendar startDay={startDay} endDay={endDay}></HeaderCalendar>
        <ContainerBookingView
          width={size.width}
          height={size.height}
          numberOfDay={getNumberOfDay(startDay, endDay)}
        >
          {renderRowsInCalendar(searchResult, numberOfDay)}
        </ContainerBookingView>
      </DateBooking>
    </Container>
  );
}
TableCalendar.propTypes = {
  startDay: PropTypes.instanceOf(moment),
  endDay: PropTypes.instanceOf(moment),
};
export default TableCalendar;