import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { ReactNode, useEffect } from "react";

type CarouselProps = {
  options?: EmblaOptionsType;
  slides: ReactNode[];
};

export default function HomeCarousel(props: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, props.slides]);

  return (
    <div className="w-full h-full embla" ref={emblaRef}>
      <div className="w-full h-full embla__container">
        {props.slides.map((slide, index) => (
          <div className="w-full h-full embla__slide" key={index}>
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}
