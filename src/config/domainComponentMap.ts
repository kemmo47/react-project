export const DOMAIN_COMPONENT_MAP: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => Promise<{ default: React.ComponentType<any> }>
> = {
  'audio-takakuureru.com': () => import('../forms/audio/AudioForm'),
  'camera-takakuureru.com': () => import('../forms/camera/CameraForm'),
}
