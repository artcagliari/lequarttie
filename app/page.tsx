import { About } from "@/components/sections/About";
import { Brands } from "@/components/sections/Brands";
import { CallToAction } from "@/components/sections/CallToAction";
import { Editorial } from "@/components/sections/Editorial";
import { Feminine } from "@/components/sections/Feminine";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Lookbook } from "@/components/sections/Lookbook";
import { Masculine } from "@/components/sections/Masculine";
import { News } from "@/components/sections/News";
import { Reviews } from "@/components/sections/Reviews";
import { Store } from "@/components/sections/Store";
import { brands } from "@/data/brands";
import { reviews } from "@/data/reviews";
import { catalog } from "@/lib/catalog";
import { findMedia, pickMedia, recentMedia, type PickMediaOptions } from "@/lib/media";
import type { MediaCategory, Visual } from "@/lib/types";

export default function Home() {
  const usedMediaIds = new Set<string>();

  const reserve = <T extends Visual>(visual: T) => {
    if (visual.kind === "photo") usedMediaIds.add(visual.id);
    return visual;
  };

  const pickUnique = (
    category: MediaCategory,
    count: number,
    options: Omit<PickMediaOptions, "excludeIds"> = {},
  ) => pickMedia(category, count, { ...options, excludeIds: usedMediaIds }).map(reserve);

  // Hero: prefere uma campanha exclusiva de cada gênero e reserva fotos diferentes.
  const campaignOrLook = (gender: "feminino" | "masculino") => {
    const otherGender = gender === "feminino" ? "masculino" : "feminino";
    const campaign =
      findMedia("campanha", {
        excludeIds: usedMediaIds,
        requiredCategories: [gender],
        excludedCategories: [otherGender],
      }) ??
      findMedia("campanha", {
        excludeIds: usedMediaIds,
        requiredCategories: [gender],
      });

    return reserve(campaign ?? pickMedia(gender, 1, { excludeIds: usedMediaIds })[0]);
  };

  const campaigns = [
    { id: "feminino", label: "Coleção feminina", visual: campaignOrLook("feminino") },
    { id: "masculino", label: "Coleção masculina", visual: campaignOrLook("masculino") },
  ];
  const heroMediaIds = new Set(usedMediaIds);

  const masculine = pickUnique("masculino", 5);
  const feminine = pickUnique("feminino", 5);
  const aboutMain = pickUnique("loja", 1)[0];
  const aboutDetail = pickUnique("detalhe", 1, { tones: ["taupe"] })[0];
  const editorial = pickUnique("campanha", 3, { tones: ["graphite", "taupe", "ivory"] });
  const news = recentMedia(4, { excludeIds: usedMediaIds });
  news.forEach((item) => usedMediaIds.add(item.id));
  const store = pickUnique("loja", 3, { tones: ["graphite", "ivory", "taupe"] });

  return (
    <>
      <Hero campaigns={campaigns} />
      <About main={aboutMain} detail={aboutDetail} />
      <Feminine visuals={feminine} />
      <Masculine visuals={masculine} />
      <Lookbook looks={catalog.listLooks({ excludeMediaIds: heroMediaIds })} />
      <Editorial visuals={editorial} />
      <News items={news} />
      <Brands brands={brands} />
      <Store visuals={store} />
      <Reviews reviews={reviews} />
      <CallToAction />
      <Location />
    </>
  );
}
