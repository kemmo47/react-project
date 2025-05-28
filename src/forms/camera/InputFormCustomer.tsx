type InputFormCustomerProps = {
  label: string
  isRequired: boolean
  classNameLabel: string
  children?: React.ReactNode
  errorMessage?: string
}

const InputFormCustomer = ({
  label,
  classNameLabel,
  isRequired,
  children,
  errorMessage,
}: InputFormCustomerProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <label className={classNameLabel}>
        <span>{label}</span>
        {isRequired && (
          <span className="text-xs text-white bg-[#dc3848] px-[9px] py-[3px] rounded font-medium sm:text-sm sm:py-0.5">
            必須
          </span>
        )}
      </label>
      {children}
      {errorMessage && <span className="text-sm text-red-500 pt-0.5">{errorMessage}</span>}
    </div>
  )
}
export default InputFormCustomer
