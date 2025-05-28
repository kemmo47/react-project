import type { Icon } from '@/types/icon'

const Prev = ({ strokeWidth, classNameSvg, classNameI }: Icon) => {
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
          d="M1 4L13 4M1 4L4.42857 0.999999M1 4L4.42857 7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </i>
  )
}

export default Prev
