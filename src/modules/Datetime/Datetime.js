import _ from 'lodash'
import cx from 'classnames'
import React, { Children, cloneElement, PropTypes } from 'react'
import Calendar from './Calendar'
import Popup from '../Popup/Popup'
import {
  AutoControlledComponent as Component,
  createShorthand,
  customPropTypes,
  isBrowser,
  keyboardKey,
  makeDebugger,
  META,
  useKeyOnly,
  useKeyOrValueAndKey,
} from '../../lib'
import {dateFormatter, timeFormatter} from '../../lib/dateUtils'

const debug = makeDebugger('datetime')

const _meta = {
  name: 'Datetime',
  type: META.TYPES.MODULE,
}

const _content = {
  daysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  daysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  today: 'Today',
  now: 'Now',
  am: 'AM',
  pm: 'PM',
}

/**
 * A <Datetime/> allows a user to select a calendar date and/or time as well
 * as handle date ranges.
 * @see Form
 */
export default class Datetime extends Component {
  static _meta = _meta

  static propTypes = {
    /** An element type to render as (string or function). */
    as: customPropTypes.as,

    /** Additional classes. */
    className: PropTypes.string,

    /** Whether or not the menu should close when the dropdown is blurred. */
    closeOnBlur: PropTypes.bool,

    /**
     * Textual content for the various text element of the calendar.
     * {
     *   daysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
     *   daysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
     *   months: [
     *     'January',
     *     'February',
     *     'March',
     *     'April',
     *     'May',
     *     'June',
     *     'July',
     *     'August',
     *     'September',
     *     'October',
     *     'November',
     *     'December',
     *   ],
     *   monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', Nov', 'Dec'],
     *   today: 'Today',
     *   now: 'Now',
     *   am: 'AM',
     *   pm: 'PM',
     * }
     * @type {Object}
     */
    content: PropTypes.object,

    /**
     * A function that will return a Date object as a formatted string in the
     * current locale. By default the Date will formatted as YYYY-MM-DD
     * @type {function}
     */
    dateFormatter: PropTypes.func,

    /**
     * A function that will return the time image of a Date object as a formatted
     * string in the current locale. By default the time will be formatted as HH:MM
     * @type {function}
     */
    timeFormatter: PropTypes.func,

    /** Initial value of open. */
    defaultOpen: PropTypes.bool,

    /** Current value as a Date object or a string that can be parsed into one.
     * Creates a controlled component.
     */
    value: customPropTypes.DateValue,

    /** Initial value as a Date object or a string that can be parsed into one */
    defaultValue: customPropTypes.DateValue,

    /** A disabled dropdown menu or item does not allow user interaction. */
    disabled: PropTypes.bool,

    /** An errored dropdown can alert a user to a problem. */
    error: PropTypes.bool,

    /** First day of the week. Can be either 0 (Sunday), 1 (Monday) **/
    firstDayOfWeek: PropTypes.number,

    /** A dropdown can take the full width of its parent */
    fluid: PropTypes.bool,

    /** A dropdown menu can contain a header. */
    header: PropTypes.node,

    /** Shorthand for Icon. */
    icon: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.object,
    ]),

    /** A dropdown can be formatted to appear inline in other content. */
    inline: PropTypes.bool,

    /** Name of the input field which holds the date value */
    name: PropTypes.string,

    /**
     * Called on blur.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props.
     */
    onBlur: PropTypes.func,

    /**
     * Called when the user attempts to change the value.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onChange: PropTypes.func,

    /**
     * Called when a close event happens.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props.
     */
    onClose: PropTypes.func,

    /**
     * Called when an open event happens.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props.
     */
    onOpen: PropTypes.func,

    /**
     * Called on click.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props.
     */
    onClick: PropTypes.func,

    /**
     * Called on focus.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props.
     */
    onFocus: PropTypes.func,

    /**
     * Called on mousedown.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props.
     */
    onMouseDown: PropTypes.func,

    /** Controls whether or not the dropdown menu is displayed. */
    open: PropTypes.bool,

    /** Whether or not the menu should open when the dropdown is focused. */
    openOnFocus: PropTypes.bool,

    /** Placeholder text. */
    placeholder: PropTypes.string,

    /**
     * Handle a date range. This will cause the Datetime component to
     * render two calendar months which represent the start and end
     * of the range
     * @type {bool}
     */
    range: PropTypes.bool,

    /**
     * A function that takes (data, index, defaultLabelProps) and returns
     * shorthand for Label .
     */
    renderLabel: PropTypes.func,

    /** Define whether the highlighted item should be selected on blur. */
    selectOnBlur: PropTypes.bool,

    /** A dropdown can receive focus. */
    tabIndex: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    /**
     * Allows time selection. This will cause the component to offer a
     * time selection as well as the calendar date.
     * @type {bool}
     */
    time: PropTypes.bool,
  }

  static autoControlledProps = [
    'open',
    'value',
  ]

  static defaultProps = {
    icon: 'calendar',
    content: _content,
    dateFormatter: dateFormatter,
    timeFormatter: timeFormatter
  }

  open = (e) => {
    debug('open()')

    const { disabled, onOpen, search } = this.props
    if (disabled) return
    if (search && this._search) this._search.focus()
    if (onOpen) onOpen(e, this.props)

    this.trySetState({ open: true })
  }

  close = (e) => {
    debug('close()')

    const { onClose } = this.props
    if (onClose) onClose(e, this.props)

    this.trySetState({ open: false })
  }

  toggle = (e) => this.state.open ? this.close(e) : this.open(e)

  handleClick = (e) => {
    debug('handleClick()', e)
    const { onClick } = this.props
    if (onClick) onClick(e, this.props)
    // prevent closeOnDocumentClick()
    e.stopPropagation()
    this.toggle(e)
  }

  handleDateSelection = (date, e) => {
    debug('handleDateSelection()', date, e)
    e.stopPropagation()
    const selectedDate = new Date(date)
    this.trySetState({
        value: selectedDate,
    })
    this.close()
  }

  /**
   * Return a formatted date or date/time string
   */
  getFormattedDate(date) {
    const {
      time,
      dateFormatter,
      timeFormatter
    } = this.props
    if (time) {
      return `${dateFormatter(this.state.value)} ${timeFormatter(this.state.value)}`
    } else {
      return dateFormatter(this.state.value)
    }
  }

  render() {
    const {
        className,
        time,
        timeFormatter,
        firstDayOfWeek,
        placeholder,
        fluid,
        icon,
        name,
        error
    } = this.props
    const { open, value } = this.state
    const classes = cx(
      'ui input left icon',
      {error, fluid},
      className
    )
    const iconClasses = cx(icon, 'icon')
    const formattedValue = this.getFormattedDate(value)
    const monthDisplay = (
      <div >
          <Calendar
            content={this.props.content}
            onDateSelect={this.handleDateSelection}
            timeFormatter={timeFormatter}
            firstDayOfWeek={firstDayOfWeek}
            time={time}/>
      </div>
    )
    let _text = placeholder || ''
    const element = (
      <div
        className={classes}
        onClick={this.handleClick}
      >
        <i className={iconClasses}/>
        <input name={name} type='text' value={formattedValue} placeholder={_text}/>
      </div>
    )
    return (
      <Popup
        trigger={element}
        on='click'
        position='bottom left'
        open={open}>{monthDisplay}</Popup>
    )
  }
}
