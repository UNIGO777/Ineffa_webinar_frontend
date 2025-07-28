import React from 'react';
import CurvedCarousel from '../Carosel';

const CarouselDemo = () => {
  // Sample images for the carousel
  const sampleImages = [
    {
      src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop&crop=center',
      alt: 'Finance Workshop',
      title: 'Finance & Investment Workshop'
    },
    {
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop&crop=center',
      alt: 'Career Development',
      title: 'Career Development Session'
    },
    {
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&crop=center',
      alt: 'Networking Event',
      title: 'Professional Networking'
    },
    {
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=center',
      alt: 'Team Building',
      title: 'Team Building Activities'
    },
    {
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
      alt: 'Leadership Training',
      title: 'Leadership Training Program'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Curved 3D Carousel Demo
          </h1>
          <p className="text-gray-300 text-lg">
            Experience our beautiful curved carousel with smooth 3D animations
          </p>
        </div>
        
        <div className="mb-12">
          <CurvedCarousel 
            images={sampleImages}
            autoPlay={true}
            autoPlayInterval={5000}
          />
        </div>
        
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">3D Curved Layout</h3>
              <p className="text-gray-300">
                Images are arranged in a beautiful curved arc with realistic 3D positioning
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Smooth Animations</h3>
              <p className="text-gray-300">
                Powered by Framer Motion for buttery smooth transitions and interactions
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Interactive Controls</h3>
              <p className="text-gray-300">
                Click images, use navigation buttons, or let it auto-play
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselDemo;
