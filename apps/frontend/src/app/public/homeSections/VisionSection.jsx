import { Eye } from 'lucide-react';
import { visionData } from '../../../lib/dumyData';

export default function VisionSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Eye className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{visionData.title}</h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            {visionData.mainText}
          </p>
          <div className="mt-6 w-24 h-1 bg-yellow-400 mx-auto"></div>
          <p className="text-lg text-blue-200 mt-6 italic">
            "{visionData.secondaryText}"
          </p>
        </div>
      </div>
    </section>
  );
}