import { Site } from '@/types'

export type PageStep = {
  title: string
  titleStep?: string
  description: string
}

export type DomainHead = {
  favicon: () => Promise<{ default: string }>
  logo: () => Promise<{ default: string }>
  pageStep: Record<string, PageStep>
}

export const DOMAIN_HEAD_MAP: Record<Site, DomainHead | undefined> = {
  'audio-takakuureru.com': {
    favicon: () => import('../assets/audio/favicon.ico'),
    logo: () => import('../assets/audio/logo.png'),
    pageStep: {
      '1': {
        title: 'Bước 1: Chọn loại camera',
        titleStep: '来店申込',
        description: 'Vui lòng chọn loại camera bạn muốn sử dụng.',
      },
      '2': {
        title: 'Bước 2: Chọn độ phân giải',
        titleStep: '商品情報',
        description: 'Vui lòng chọn độ phân giải bạn muốn sử dụng.',
      },
      '3': {
        title: 'Bước 3: Xác nhận',
        titleStep: '商品確認',
        description: 'Vui lòng xác nhận thông tin bạn đã chọn.',
      },
      thanks: {
        title: 'Cảm ơn',
        description: 'Cảm ơn bạn đã hoàn thành.',
      },
    },
  },
  'camera-takakuureru.com': {
    favicon: () => import('../assets/camera/favicon.ico'),
    logo: () => import('../assets/camera/logo.png'),
    pageStep: {
      '1': {
        title: 'Bước 1: Chọn loại camera',
        titleStep: '来店申込',
        description: 'Vui lòng chọn loại camera bạn muốn sử dụng.',
      },
      '2': {
        title: 'Bước 2: Chọn độ phân giải',
        titleStep: '商品情報',
        description: 'Vui lòng chọn độ phân giải bạn muốn sử dụng.',
      },
      '3': {
        title: 'Bước 3: Xác nhận',
        titleStep: '商品確認',
        description: 'Vui lòng xác nhận thông tin bạn đã chọn.',
      },
      '4': {
        title: 'Bước 4: Hoàn tất',
        titleStep: 'お客様情報',
        description: 'Vui lòng kiểm tra lại thông tin và hoàn tất.',
      },
      thanks: {
        title: 'Cảm ơn',
        description: 'Cảm ơn bạn đã hoàn thành.',
      },
    },
  },
  'beauty-takakuureru.com': undefined,
  'bicycle-takakuureru.com': undefined,
  'brand-takakuureru.com': undefined,
  'car-takakuureru.com': undefined,
  'delivery-kaitori.com': undefined,
  'figure-takakuureru.com': undefined,
  'fishing-takakuureru.com': undefined,
  'g-takakuureru.com': undefined,
  'gakki-takakuureru.com': undefined,
  'guitar-kaitori.com': undefined,
  'gun-takakuureru.com': undefined,
  'kaden-takakuureru.com': undefined,
  'kagu-takakuureru.com': undefined,
  'kenki-takakuureru.com': undefined,
  'kougu-takakuureru.com': undefined,
  'kyozai-takakuureru.com': undefined,
  'mbrand-takakuureru.com': undefined,
  'navi-takakuureru.com': undefined,
  'noukigu-takakuureru.com': undefined,
  'pc-takakuureru.com': undefined,
  'sax-takakuureru.com': undefined,
  'sports-takakuureru.com': undefined,
  'syuttyou-kaitori.com': undefined,
  'takakuureru.com': undefined,
  'tokei-takakuureru.com': undefined,
  'train-takakuureru.com': undefined,
  'tv-takakuureru.com': undefined,
}
