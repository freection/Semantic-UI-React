import _ from 'lodash'
import cx from 'classnames'
import React, { Component, PropTypes } from 'react'

import {
  childrenUtils,
  createShorthand,
  customPropTypes,
  META,
  getElementType,
  getUnhandledProps,
  useKeyOnly,
} from '../../lib'

/**
 * A day cell within a calendar month
 */
export default class DayCell extends Component {
  static propTypes = {
    /** An element type to render as (string or function). */
    as: customPropTypes.as,

    /** Style as the currently chosen item. */
    active: PropTypes.bool,

    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,

    /** A dropdown item can be disabled. */
    disabled: PropTypes.bool,

    /**
     * The item currently selected by keyboard shortcut.
     * This is not the active item.
     */
    selected: PropTypes.bool,

    /** Display text. */
    text: customPropTypes.contentShorthand,

    /** Stored value */
    day: PropTypes.number,

    /**
     * Called on click.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props.
     */
    onClick: PropTypes.func,
  }

  static _meta = {
    name: 'DayCell',
    parent: 'Datetime',
    type: META.TYPES.MODULE,
  }

  handleClick = (e) => {
    const { onClick } = this.props

    if (onClick) onClick(e, this.props)
  }

  render() {
    const {
      active,
      children,
      className,
      disabled,
      selected,
      text,
    } = this.props

    const classes = cx(
      useKeyOnly(active, 'active'),
      useKeyOnly(disabled, 'disabled'),
      useKeyOnly(selected, 'selected'),
      'item',
      className,
    )
    const rest = getUnhandledProps(DayCell, this.props)
    const ElementType = getElementType(DayCell, this.props)
    const ariaOptions = {
      role: 'option',
      'aria-disabled': disabled,
      'aria-checked': active,
      'aria-selected': selected,
    }

    if (!_.isNil(children)) {
      return (
        <ElementType {...rest} {...ariaOptions} className={classes} onClick={this.handleClick}>
          {children}
        </ElementType>
      )
    }

    return (
      <ElementType {...rest} {...ariaOptions} className={classes} onClick={this.handleClick}>
        {content || text}
      </ElementType>
    )
  }
}
