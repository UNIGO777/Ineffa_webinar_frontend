import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1753596109450-fe86277a8982?q=80&w=2350&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1741712589968-f61c606a0220?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1751076547690-09952d86c2ce?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1752586609110-9ce679a15b5e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1752654976506-d74220924976?q=80&w=1326&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1753097916730-4d32f369bbaa?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const getCarouselStyle = (offset) => {
  const styles = {
    "-2": { x: -420, rotateY: 40, scale: 0.88, zIndex: 1, opacity: 0.4 },
    "-1": { x: -210, rotateY: 20, scale: 0.95, zIndex: 2, opacity: 0.7 },
    "0": { x: 0, rotateY: 0, scale: 1, zIndex: 3, opacity: 1 },
    "1": { x: 210, rotateY: -20, scale: 0.95, zIndex: 2, opacity: 0.7 },
    "2": { x: 420, rotateY: -40, scale: 0.88, zIndex: 1, opacity: 0.4 },
  };
  return styles[offset] || { x: 0, rotateY: 0, scale: 0.5, zIndex: 0, opacity: 0 };
};

export default function ImageCarousel() {
  const [centerIndex, setCenterIndex] = useState(2);

  const visibleOffsets = [2, 1, 0, -1, -2].map((offset) => {
    const index = (centerIndex + offset + images.length) % images.length;
    return { index, offset };
  });

  const next = () => setCenterIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCenterIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="w-full overflow-hidden bg-white py-20 flex flex-col items-center">
      <div className="relative w-[1680px] h-[360px] perspective-[2000px] flex items-center justify-center">
        {visibleOffsets.map(({ index, offset }) => {
          const { x, rotateY, scale, zIndex, opacity } = getCarouselStyle(offset);

          return (
            <motion.div
              key={index}
              className="absolute top-0   w-64 h-80  overflow-hidden  bg-white"
              animate={{
                x,
                rotateY,
                scale,
                zIndex,
                opacity,
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
              }}
            >
              <img
                src={images[index]}
                alt={`carousel-${index}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Arrows */}
      <div className="mt-12 flex gap-6">
        <button
          onClick={prev}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <button
          onClick={next}
          className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
}
