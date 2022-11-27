export interface IBasePlan {
    altBundleIds: Array<string>;
    archived: string;
    id: string;
    data: number;
    mms: number;
    days: number;
    messages: number;
    minutes: number;
    price: number;
    title: string;
    subtitle: string;
    virtual?: boolean;
    buttonText?: string;
    parentId?: string;
    bundleId?: string;
    extTitle?: string;
    order?: number;
    description?: string;
    promoMessage?: string;
    featured?: boolean;
    promoCode?: string;
    promoPrice?: number;
    promoMonths?: number;
}
  
  export interface IFeaturedPlanSwiperConfig {
    planSlides: IBasePlan[];
  }
  