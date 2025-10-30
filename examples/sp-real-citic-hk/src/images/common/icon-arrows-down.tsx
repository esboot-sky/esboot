const IconArrowsDown = ({ arrows = false }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g style={{
      transform: arrows ? 'translate(12px,12px)rotate(180deg)' : '',
    }}
    >
      <path d="M8 5L6 7L4 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </g>

  </svg>
);

export default IconArrowsDown;
