import { Eye } from 'lucide-react';
import { visionData } from '../../../lib/dumyData';

const VisionSection = () => {
  return (
    <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-white">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/3 flex justify-center">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Eye className="w-16 h-16 text-white" />
          </div>
        </div>
        <div className="md:w-2/3">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Vision</h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            {visionData.mainText}
          </p>
          <div className="my-4 w-20 h-1 bg-yellow-400"></div>
          <p className="text-lg text-blue-200 leading-relaxed">
            {visionData.subText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisionSection;