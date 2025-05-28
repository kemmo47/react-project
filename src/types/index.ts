export type Site =
  | 'audio-takakuureru.com'
  | 'beauty-takakuureru.com'
  | 'bicycle-takakuureru.com'
  | 'brand-takakuureru.com'
  | 'camera-takakuureru.com'
  | 'car-takakuureru.com'
  | 'delivery-kaitori.com'
  | 'figure-takakuureru.com'
  | 'fishing-takakuureru.com'
  | 'g-takakuureru.com'
  | 'gakki-takakuureru.com'
  | 'guitar-kaitori.com'
  | 'gun-takakuureru.com'
  | 'kaden-takakuureru.com'
  | 'kagu-takakuureru.com'
  | 'kenki-takakuureru.com'
  | 'kougu-takakuureru.com'
  | 'kyozai-takakuureru.com'
  | 'mbrand-takakuureru.com'
  | 'navi-takakuureru.com'
  | 'noukigu-takakuureru.com'
  | 'pc-takakuureru.com'
  | 'sax-takakuureru.com'
  | 'sports-takakuureru.com'
  | 'syuttyou-kaitori.com'
  | 'takakuureru.com'
  | 'tokei-takakuureru.com'
  | 'train-takakuureru.com'
  | 'tv-takakuureru.com'

export type DomainStepKeys = 'index' | 'step1' | 'step2' | 'step3' | 'step4' | 'thanks'

export interface CenterList {
  address: string
  business_domain: string
  holidays: string
  hours: string
  link: string
  name: string
  parking: string
  short_link: string
}

export interface FormLocation {
  pref: string
  address: string
  zip: string
}
