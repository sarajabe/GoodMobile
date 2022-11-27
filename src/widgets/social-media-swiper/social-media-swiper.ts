export interface ISocialMediaSlide {
    message: string;
    userName: string;
    alt?: string;
    address?: string;
  }
 
  export interface ISocialMediaSwiperConfig {
    slides: ISocialMediaSlide[];
  }
 