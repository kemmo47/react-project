import type { Icon } from '@/types/icon'

const Next = ({ strokeWidth, classNameSvg, classNameI }: Icon) => {
  return (
    <i className={classNameI}>
      <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        className={classNameSvg}
        strokeWidth={strokeWidth}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 4H1M13 4L9.57143 7M13 4L9.57143 1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </i>
  )
}

export default Next
