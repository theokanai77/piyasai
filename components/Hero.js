import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import ButtonSignin from "./ButtonSignin";
import config from "@/config";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
          Piyasayı Saatlerce Araştırmayın, Akıllı Yatırım Yapın
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Piyasayı uzun videolarla ve fırsatları kaçırarak değil, akıllı
          özetlerle, herşeyi saniyeler içinde yakalayarak ve robotlara algolara
          karşı küçük yatırımcı hareketine katılarak takip edin!
        </p>
        <ButtonSignin
          text={`${config.appName} Başlat`}
          extraStyle="btn-primary btn-wide"
        />

        <TestimonialsAvatars priority={true} />
      </div>
      <div className="lg:w-full">
        <Image
          src="/piyasai.png"
          alt="Product Demo"
          className="w-full"
          priority={true}
          width={500}
          height={500}
        />
      </div>
    </section>
  );
};

export default Hero;
