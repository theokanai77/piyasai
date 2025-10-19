import Link from "next/link";

export default function VerificationDeniedPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Hero Section with Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-500/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            X Doğrulama Gerekiyor
          </h1>
        </div>

        {/* Body Text */}
        <div className="mb-8">
          <p className="text-gray-300 text-lg leading-relaxed">
            Lütfen X'te fitkayme hesabını takip edin ve DM ile email adresinizi
            paylaşın. Hata varsa, lütfen fitkayme ile iletişime geçin.{" "}
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Ana Sayfaya Dön
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-gray-400 text-sm">
          <p>Üzgünüz, bu konuda sıkıntı yaşıyoruz.</p>
        </div>
      </div>
    </div>
  );
}
