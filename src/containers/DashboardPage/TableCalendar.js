import React, { useContext, useRef, useState } from 'react';
import moment from 'moment';

import { getNumberOfDay } from '../../utils/Date';
import { useWindowSize } from '../../utils/Window';

import Booking from './TableCalendar/Booking';
import ContainerBookingView from './TableCalendar/Style/ContainerBookingView';
import RowBookingView from './TableCalendar/Style/RowBookingView';
// eslint-disable-next-line import/no-cycle
import ContentBooking from './TableCalendar/ContentBooking';
import DateBooking from './TableCalendar/Style/DateBooking';
import HeaderCalendar from './TableCalendar/HeaderCalendar';
import Sidebar from './ResourceBar/Sidebar';
import { CalendarContext } from '../../context/Calendar';
import Container from './TableCalendar/Style/Container';
import './TableCalendar/Style/Hover.css';

import BodyCalendar from './TableCalendar/Style/BodyCalendar';
import useCellsInCalendar from './TableCalendar/useCellsInCalendar';
import AddBookingForm from '../../components/AddBookingForm';

function TableCalendar() {
  const [size] = useWindowSize();
  const calendarContext = useContext(CalendarContext);
  const {
    getMaxTotalOverlapBooking,
    startDay,
    endDay,
    setStartDay,
    setEndDay,
    handleCloseModal,
  } = calendarContext;
  const ref = useRef({ current: { scrollTop: 0 } });
  const [scrollTop, setScrollTop] = useState(0);
  const { cells } = useCellsInCalendar(startDay, endDay);
  const numberOfDay = getNumberOfDay(startDay, endDay);
  const [content, setContent] = useState({
    resource: [],
    bookingWithResource: [],
    date: moment(),
  });
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [selecting, setSelecting] = useState(false);
  const [resourceStart, setResourceStart] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const beginSelection = (i, j) => {
    setSelecting(true);
    setStart(i);
    updateSelection(i);
    setResourceStart(j);
  };

  const endSelection = (i = end, j) => {
    setSelecting(false);
    updateSelection(i);
  };

  let updateSelection = (i, j) => {
    console.log("resouce: ", resourceStart);
    console.log("index rescoure: ", j);
    if (selecting) {
      if(j == resourceStart) {
        setEnd(i);
      }
    }
  };

  function renderBooking(bookingsInCell) {
    const bookingDateWithResourceRender = bookingsInCell.map(
      (booking, index) => (
        <Booking
          key={booking._id}
          color="green"
          isDuration
          isFirst={index === 0}
          booking={booking}
        ></Booking>
      ),
    );
    return bookingDateWithResourceRender;
  }
  const renderCellsInCalendar = (resource, row, indexResource) => {
    const handleOnClick = (bookingsInCell, date) => {
      setContent({ resource, bookingsInCell, date });
    };
    const k = numberOfDay * indexResource;
    const days = row.map((cell, i) => {
      const { dateInCell, isWeekend, bookingsInCell } = cell;
      const bookingDateWithResource = renderBooking(bookingsInCell);

      const cellValue = [dateInCell.toString(), indexResource];
      return (
        <ContentBooking
          onClick={() => {
            setStart(0);
            setEnd(0);
            handleOnClick(dateInCell, moment(dateInCell));
            handleCloseModal();
          }}
          onMouseDown={() => beginSelection(k + i, indexResource)}
          onMouseUp={() => endSelection(k + i, indexResource)}
          onMouseMove={() => updateSelection(k + i, indexResource)}
          value={cellValue}
          inputColor={
             ((end <= k + i && k + i <= start || (start<= k+i && k+i <= end) && (resourceStart == indexResource)) ? "#D8D8D8": "" )
          }
          isWeekend={isWeekend}
          key={`${dateInCell} ${indexResource}`}
        >
          {bookingDateWithResource}
        </ContentBooking>
      );
    });
    return days;
  };
  const renderRowsInCalendar = () => {
    const renderCells = cells.map((row, indexResource) => {
      const { contentResource, resource } = row;
      const days = renderCellsInCalendar(
        resource,
        contentResource,
        indexResource,
      );
      return (
        <RowBookingView
          key={resource._id}
          overlapBooking={getMaxTotalOverlapBooking(resource._id)}
        >
          {days}
        </RowBookingView>
      );
    });
    return renderCells;
  };
  const checkOnBoundScroll = () => {
    const { clientWidth, scrollWidth, scrollLeft } = ref.current;
    if (scrollLeft + clientWidth === scrollWidth) {
      setEndDay(moment(endDay.toString()).add(35, 'days'));
    }
    if (scrollLeft === 0) {
      setStartDay(moment(startDay.toString()).add(-35, 'days'));
    }
    setScrollTop(ref.current.scrollTop);
  };

  return (
    <Container height={size.height} width={size.width}>
      <Sidebar
        scrollTop={scrollTop}
        getMaxTotalOverlapBooking={getMaxTotalOverlapBooking}
      ></Sidebar>
      <DateBooking ref={ref} height={size.height} onScroll={checkOnBoundScroll}>
        <HeaderCalendar startDay={startDay} endDay={endDay}></HeaderCalendar>
        <BodyCalendar>
          <ContainerBookingView
            width={size.width}
            numberOfDays={getNumberOfDay(startDay, endDay)}
          >
            {renderRowsInCalendar()}
          </ContainerBookingView>
        </BodyCalendar>
      </DateBooking>
      <AddBookingForm content={content} />
    </Container>
  );
}
export default TableCalendar;
