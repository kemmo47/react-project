import { checkZipCodeCombineAddress, getAddressByZipCode } from '@/api/location'
import { PREFECTURES } from '@/constants'
import { useFormStore } from '@/store'
import axios from 'axios'

export const errorMessage = {
  nameRequired: 'お名前（漢字）は必須項目です',
  phoneRequired: '電話番号は必須項目です',
  emailRequired: '電話番号は必須項目です',
  emailInvalid: '正しいメールアドレスを入力してください',
  personalInformationRequired: '個人情報の取り扱いについては必須項目です',
  phoneNumberInvalid: '正しい電話番号を入力してください',
  zipCodeRequired: '郵便番号は必須項目です',
  zipCodeDoesNotExist: 'その郵便番号は存在しません',
  zipCodeCombineAddress: '郵便番号と都道府県、住所の組み合わせが間違っています',
  prefRequired: '都道府県は必須項目です',
  addressRequired: '住所(町名)は必須項目です',
  addressIncludesPref: '住所内に都道府県は入れられません',
  addressAddRequired: '住所(番地・建物名)は必須項目です',
  phone_10: '10文字以上で入力してください',
  phone_than_11: '11文字以内で入力してください',
  phone_char: '数字を入力してください',
}

// 2 bytes to 1 byte
export const convert2BytesTo1Byte = (str: string) => {
  if (!str) {
    return
  }
  str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 65248)
  })
  str = str.replace(/[−―‐ー]/g, '-')
  str = str.replace(/＠/g, '@')
  return str
}

export const isValidPhoneNumber = (value: string) => {
  const phone = convert2BytesTo1Byte(value)
  if (!phone) {
    return false
  }
  return phone.match(/^[0-9-]{10,13}$/)
}

export const formatZipCode = (zipCodeVal: string) => {
  let zipCode = convert2BytesTo1Byte(zipCodeVal)
  if (!zipCode) {
    return null
  }
  zipCode = zipCode.split('-').join('').trim()
  if (!zipCode.match(/^[0-9]{7}$/)) {
    return null
  }

  return zipCode
}

export const isValidZipCode = async (zipCodeVal: string, pref: string, address: string) => {
  const zipCode = formatZipCode(zipCodeVal)

  if (!zipCode) {
    return errorMessage.zipCodeDoesNotExist
  }

  const addressData = await getAddressByZipCode(zipCode)
  if (addressData === null) {
    return errorMessage.zipCodeDoesNotExist
  }

  if (pref && address) {
    const isValid = await checkZipCodeCombineAddress(zipCode, pref, address)
    if (!isValid) {
      return errorMessage.zipCodeCombineAddress
    }
  }

  return true
}

export const isValidAddress = async (zipCodeVal: string, pref: string, address: string) => {
  const zipCode = formatZipCode(zipCodeVal)

  const foundPref = PREFECTURES.find((pref) => address.startsWith(pref.value))
  if (foundPref) {
    return errorMessage.addressIncludesPref
  }

  if (zipCode && pref && address) {
    const isValid = await checkZipCodeCombineAddress(zipCode, pref, address)
    if (!isValid) {
      return errorMessage.zipCodeCombineAddress
    }
  }

  return true
}

export const isValidPref = async (zipCodeVal: string, pref: string, address: string) => {
  const zipCode = formatZipCode(zipCodeVal)

  if (zipCode && pref && address) {
    const isValid = await checkZipCodeCombineAddress(zipCode, pref, address)
    if (!isValid) {
      return errorMessage.zipCodeCombineAddress
    }
  }

  return true
}

export const validateKana = (kana: string) => {
  let isOk = true
  kana = kana.trim()

  if (kana.length > 0) {
    if (!kana.match(/^[ぁ-ゔァ-ヴー \u3000a-zA-Z]*$/)) {
      isOk = false
    }
  }

  return isOk
}

export const validateEmail = async (email: string) => {
  let result = true

  if (email.length > 0) {
    if (email.match(/^([a-zA-Z0-9])+([a-zA-Z0-9._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9._-]+)+$/)) {
      const api_url = 'https://5ezfumbyja.execute-api.ap-northeast-1.amazonaws.com/v1/email_valid'
      await axios
        .get(api_url, {
          params: {
            email: email,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          if (res.data.success) {
            result = true
          } else {
            result = false
          }
        })
        .catch(() => {
          result = false
        })
    } else {
      result = false
    }
  }

  return result
}

export const validatePhoneNumber = (phone: string) => {
  const result = {
    status: true,
    msg: '',
  }

  if (phone.length > 0) {
    if (!phone.match(/^\d+$/)) {
      result.status = false
      result.msg = errorMessage.phone_char
    } else if (phone.length < 10) {
      result.status = false
      result.msg = errorMessage.phone_10
    } else if (phone.length > 11) {
      result.status = false
      result.msg = errorMessage.phone_than_11
    }
  }

  return result
}

export const fetchAddress = async (zipCodeVal?: string) => {
  try {
    const zipCode = formatZipCode(zipCodeVal ?? '')
    if (!zipCode) {
      return false
    }

    const data = await getAddressByZipCode(zipCode)
    if (data === null) {
      return false
    }

    const customerInfo = useFormStore.getState().customerInfo
    if (!customerInfo) {
      return false
    }
    customerInfo.pref = data.pref
    customerInfo.zipCode = data.zip

    if (customerInfo.address) {
      if (~customerInfo.address.indexOf(data.address)) {
        // 都道府県と番地の組み合わせを正規表現で置き換え
        // $1 → 市区町村
        // $2 → 番地
        const pattern = new RegExp('.*?(' + data.address + ')(.*)', 'g')
        const result = customerInfo.address.replace(pattern, '$1$2')

        customerInfo.address = result
      } else {
        // 検索された住所と入っていた住所が異なる場合は上書き
        customerInfo.address = data.address
      }
    } else {
      customerInfo.address = data.address
    }

    return true
  } catch (error) {
    console.error('Error fetching address:', error)
    return false
  }
}
