import Image from 'next/image';

interface HomepageHeroSectionProps {
  showHeroImage: boolean;
  profilePicture?: string;
}

export default function HomepageHeroSection({
  showHeroImage,
  profilePicture
}: HomepageHeroSectionProps) {
  // Only show hero section if setting is enabled AND profile picture URL exists
  if (!showHeroImage || !profilePicture) return null;

  // Generate a simple blur data URL for remote images
  const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  return (
    <section className="relative w-full max-h-[400px] h-[400px] overflow-hidden rounded-lg border-2 border-slate-700">
      {/* Fixed 600px height for consistent experience across all devices */}
      {/* Hero image with Next.js blur placeholder */}
      <Image
        src={profilePicture}
        alt="Hero Image"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="object-cover"
        style={{
          objectPosition: 'center center'
        }}
      />
    </section>
  );
}