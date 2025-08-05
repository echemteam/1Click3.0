import React from 'react';
import PropTypes from 'prop-types';
import './Badge.scss';

/**
 * Badge component to display a badge with customizable content, color, and position.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The content over which the badge will be displayed.
 * @param {number} [props.badgeContent=0] - The number to display inside the badge.
 * @param {number} [props.max=99] - The maximum number to display; if badgeContent exceeds this, it shows as 'max+'.
 * @param {string} [props.color='red'] - The background color of the badge.
 * @param {string} [props.position='top-right'] - The position of the badge relative to its children.
 * @returns {JSX.Element} The Badge component.
 *
 * @example
 * <Badge badgeContent={120} max={99} color="blue" position="top-right">
 *   <Iconify icon="mdi:comments-outline" width={40} />
 * </Badge>
 */
const Badge = ({ 
  children, 
  badgeContent = 0, 
  max = 99, 
  color = '', 
  position = 'top-right' 
}) => {
  const displayContent = badgeContent > max ? `${max}+` : badgeContent;

  return (
    <div className="custom-badge">
      {children}
      <span 
        className={`badge ${position}`} 
        style={{ backgroundColor: color }}
      >
        {displayContent}
      </span>
    </div>
  );
};

Badge.propTypes = {
  /** The content over which the badge will be displayed. */
  children: PropTypes.node.isRequired,
  /** The number to display inside the badge. */
  badgeContent: PropTypes.number,
  /** The maximum number to display; if badgeContent exceeds this, it shows as 'max+'. */
  max: PropTypes.number,
  /** The background color of the badge. */
  color: PropTypes.string,
  /** The position of the badge relative to its children. */
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
};

export default Badge;
