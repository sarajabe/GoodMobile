import { IFirebaseBannerSlide } from '@ztarmobile/zwp-service-backend';

export interface IBannerSwiperAdsConfig {
  theme: string;
  gridTheme?: string;
  banners: IFirebaseBannerSlide[];
  effect?: any;
}
