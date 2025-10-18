import Image from 'next/image';

interface RestaurantHeroProps {
  coverImage?: string | null;
  imageUrl?: string | null;
  name: string;
}

export default function RestaurantHero({ coverImage, imageUrl, name }: RestaurantHeroProps) {
  return (
    <div className="relative h-64 md:h-80 mb-8 rounded-b-3xl overflow-hidden">
      {coverImage || imageUrl ? (
        <Image
          src={coverImage || imageUrl || ''}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

      {/* Restaurant Logo */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={`${name} logo`}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

