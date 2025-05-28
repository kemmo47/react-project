import { formatDate } from '@/utils/dateUtils'

const Thanks = () => {
  const formDataThanks = JSON.parse(sessionStorage.getItem('form_data_thanks') || '{}')

  return (
    <div className="px-2.5 md:px-0 text-[13px] sm:text-base">
      <h1 className="text-lg font-semibold text-center mt-1.5 mb-4 sm:text-2xl">
        お申し込みを受け付けました。
      </h1>

      <div className="sm:mt-8">
        <p>お取引番号：{formDataThanks.offer_id}</p>
        <br />
        <p>確認のメールをお送りしました。</p>
        <p>申し込み内容に変更がある場合は、お電話でご連絡ください。</p>
        <br />
        <p>電話：0120-945-991（年末年始除く9:15～21:00）</p>
      </div>
      <table className="mt-3 w-full max-w-[400px] mx-auto border border-collapse border-[#d0d5dc] sm:mt-6">
        <tbody>
          <tr className="border border-[#d0d5dc]">
            <td className="text-left border border-[#d0d5dc] p-2">来店希望日</td>
            <td className="text-left border border-[#d0d5dc] p-2">
              {formatDate(Number(formDataThanks.oeoe93)).date}（
              {formatDate(Number(formDataThanks.oeoe93)).dayOfWeek}）
            </td>
          </tr>
          <tr>
            <td className="text-left border border-[#d0d5dc] p-2">店舗名</td>
            <td className="text-left border border-[#d0d5dc] p-2">
              {formDataThanks.business_name}
            </td>
          </tr>
          <tr>
            <td className="text-left border border-[#d0d5dc] p-2">住所</td>
            <td className="text-left border border-[#d0d5dc] p-2">
              {formDataThanks.business_address}
            </td>
          </tr>
          <tr>
            <td className="text-left border border-[#d0d5dc] p-2">地図</td>
            <td className="text-left border border-[#d0d5dc] p-2">
              <a
                className="text-[#1452DB]"
                rel="stylesheet"
                target="_blank"
                href={formDataThanks.business_short_link}
              >
                Googleマップ
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-base font-semibold text-center mt-6 mb-6">店頭買取に必要なもの</h2>
      <p className="font-semibold">本人確認書類（いずれか1点）</p>
      <ul className="mt-5 mb-5">
        <li className="relative pl-2 before:content-['•'] before:absolute before:left-0">
          運転免許証のコピー（住所変更のある場合は表裏）
        </li>
        <li className="relative pl-2 before:content-['•'] before:absolute before:left-0">
          保険証のコピー（表裏）
        </li>
        <li className="relative pl-2 before:content-['•'] before:absolute before:left-0">
          パスポートのコピー（顔写真と住所記載のページ）
        </li>
        <li className="relative pl-2 before:content-['•'] before:absolute before:left-0">
          住民票の写し（原本・マイナンバー省略）
        </li>
        <li className="relative pl-2 before:content-['•'] before:absolute before:left-0">
          マイナンバーカードのコピー（表面のみ）
        </li>
        <li className="relative pl-2 before:content-['•'] before:absolute before:left-0">
          外国人登録証のコピー
        </li>
      </ul>
      <p className="mb-5 sm:mb-8">
        ※ 通知カード及び、マイナンバー記載の住民票の写しはお取り扱いができません。
      </p>
    </div>
  )
}

export default Thanks
