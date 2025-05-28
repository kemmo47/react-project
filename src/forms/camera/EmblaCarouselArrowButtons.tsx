import Next from '@/components/icons/Next'
import Prev from '@/components/icons/Prev'
import React, { ComponentPropsWithRef } from 'react'

type PropType = ComponentPropsWithRef<'button'>

export const PrevButton: React.FC<PropType> = (props) => {
  const { ...restProps } = props

  return (
    <button
      className={`${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} bg-[#d0d5dc] rounded-xs cursor-pointer py-1 px-1 sm:px-1.5 hover:bg-[#cbd5e1] active:bg-[#9ca3af] focus:outline-none`}
      type="button"
      {...restProps}
    >
      <Prev classNameSvg="w-8 h-4" />
    </button>
  )
}

export const NextButton: React.FC<PropType> = (props) => {
  const { ...restProps } = props

  return (
    <button
      className={`${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} bg-[#d0d5dc] rounded-xs cursor-pointer py-1 px-1 sm:px-1.5 hover:bg-[#cbd5e1] active:bg-[#9ca3af] focus:outline-none`}
      type="button"
      {...restProps}
    >
      <Next classNameSvg="w-8 h-4" />
    </button>
  )
}
