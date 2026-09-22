export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  title: string;
}

export const carouselImages: CarouselImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop',
    alt: 'Mountain landscape at sunrise with misty valleys',
    title: 'Mountain Sunrise',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=675&fit=crop',
    alt: 'Dense forest with sunlight filtering through trees',
    title: 'Forest Light',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=675&fit=crop',
    alt: 'Crystal clear lake reflecting mountain peaks',
    title: 'Alpine Lake',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=675&fit=crop',
    alt: 'Ocean waves crashing on rocky coastline at sunset',
    title: 'Coastal Sunset',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=675&fit=crop',
    alt: 'Wildflower meadow with colorful blooms in spring',
    title: 'Spring Meadow',
  },
];