import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface DiscountWheelProps {
  onClose: () => void;
}

export const DiscountWheel: React.FC<DiscountWheelProps> = ({
  onClose
}) => {
  const { setDiscountPercent, discountPercent } = useShop();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDegree, setSpinDegree] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  const wheelSegments = [
    { value: 5, color: 'bg-stone-800 text-stone-100', text: '5% OFF' },
    { value: 15, color: 'bg-amber-500 text-stone-950', text: '15% OFF' },
    { value: 10, color: 'bg-stone-700 text-stone-100', text: '10% OFF' },
    { value: 20, color: 'bg-amber-600 text-stone-100', text: '20% OFF' },
    { value: 0, color: 'bg-stone-600 text-stone-300', text: 'NEXT TIME' },
    { value: 25, color: 'bg-yellow-500 text-stone-950 font-bold', text: '25% MEGA!' }
  ];

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    // Generate a random number of rotations (at least 5 full circles) + random segment
    const segmentCount = wheelSegments.length;
    const randomSegmentIdx = Math.floor(Math.random() * segmentCount);
    const degreePerSegment = 360 / segmentCount;
    
    // Calculate final rotation degrees
    const rotations = 360 * 6; // 6 full circles
    const segmentAngle = randomSegmentIdx * degreePerSegment;
    // Offset slightly so it lands center of segment
    const finalAngle = rotations + (360 - segmentAngle) + (degreePerSegment / 2);

    setSpinDegree(finalAngle);

    setTimeout(() => {
      const winner = wheelSegments[randomSegmentIdx];
      setWonAmount(winner.value);
      setDiscountPercent(winner.value);
      setIsSpinning(false);
      setHasSpun(true);
    }, 4000); // 4 seconds spin animation matches CSS transition
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center items-center p-4">
      
      {/* Background click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white max-w-md w-full rounded-3xl p-6 border border-stone-200 shadow-2xl relative overflow-hidden text-center space-y-6"
      >
        
        {/* Subtle decorative Indian patterns */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-stone-700 p-1.5 rounded-full border border-stone-200 shadow-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisan Cooperative Festive Offer</span>
          </span>
          <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-stone-900">
            The Handloom Loyalty Wheel
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
            Spin the wooden loom-wheel to receive a direct promotional discount code for your entire shopping basket today!
          </p>
        </div>

        {/* Visual Spinning Wheel Canvas */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          
          {/* Needle Indicator */}
          <div className="absolute top-0 z-20 -translate-y-1 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-600 filter drop-shadow-md"></div>
          
          {/* Loom Wheel Structure */}
          <div
            style={{
              transform: `rotate(${spinDegree}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
            }}
            className="w-full h-full rounded-full border-8 border-stone-900 relative overflow-hidden bg-stone-800 shadow-xl flex items-center justify-center"
          >
            {/* Center wheel pin */}
            <div className="absolute w-12 h-12 bg-stone-900 rounded-full z-15 flex items-center justify-center border-4 border-amber-500 shadow-md">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>

            {/* Slices */}
            {wheelSegments.map((seg, idx) => {
              const rotation = idx * (360 / wheelSegments.length);
              return (
                <div
                  key={idx}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: '50% 50%'
                  }}
                  className="absolute inset-0 flex justify-center"
                >
                  {/* Visual Slice Divider */}
                  <div className="absolute top-0 h-1/2 w-0.5 bg-stone-950 z-10 origin-bottom"></div>
                  
                  {/* Slice Text Content */}
                  <div className="absolute top-8 z-10 flex flex-col items-center">
                    <span className="text-[10px] font-mono font-extrabold tracking-tight uppercase leading-none origin-center transform rotate-18 rotate-180 text-white">
                      {seg.text}
                    </span>
                  </div>

                  {/* Slice Background Paint */}
                  <div 
                    style={{
                      clipPath: 'polygon(50% 50%, 0 0, 100% 0)'
                    }}
                    className={`absolute inset-0 w-full h-full ${
                      idx % 2 === 0 ? 'bg-stone-800' : 'bg-amber-500'
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spin Actions */}
        <div className="space-y-3 pt-2">
          {wonAmount !== null ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <Award className="w-7 h-7 mx-auto text-amber-500" />
              {wonAmount > 0 ? (
                <>
                  <p className="text-sm text-stone-700">Congratulations! You successfully won</p>
                  <p className="text-2xl font-black text-amber-600 font-mono">{wonAmount}% OFF YOUR CART</p>
                  <p className="text-[10px] text-stone-400">This discount code is automatically active and applied in your checkout totals.</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-stone-700">Next time, patron!</p>
                  <p className="text-xs text-stone-500">No discount code won, but enjoy free shipping on every single authentic item in the catalog!</p>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={handleSpin}
              disabled={isSpinning || hasSpun}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:bg-stone-200 disabled:text-stone-400 cursor-pointer"
            >
              {isSpinning ? 'Weaving fortunes...' : 'Spin the Loom Wheel'}
            </button>
          )}

          <button
            onClick={onClose}
            className="text-xs text-stone-500 hover:text-stone-800 transition-all font-semibold underline block mx-auto cursor-pointer"
          >
            {hasSpun ? 'Return to Store' : 'Maybe Later'}
          </button>
        </div>

      </motion.div>
    </div>
  );
};
