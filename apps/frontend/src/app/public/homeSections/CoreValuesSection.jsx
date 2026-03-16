import { Heart } from 'lucide-react';
import { coreValuesData } from '../../../lib/dumyData';

export default function CoreValuesSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Core Values</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {coreValuesData.map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition group border-t-4 border-blue-500">
              <div className={`w-14 h-14 bg-${value.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                <value.icon className={`w-7 h-7 text-${value.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Values Summary Banner */}
        <div className="mt-12 bg-blue-600 text-white p-6 rounded-xl text-center max-w-4xl mx-auto">
          <p className="text-lg">
            <span className="font-bold">Integrity • Customer First • Responsibility • Excellence • Growth Partnership</span>
          </p>
          <p className="text-blue-200 mt-2">These values define who we are and how we serve our customers</p>
        </div>
      </div>
    </section>
  );
}