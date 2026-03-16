import { MessageSquare } from 'lucide-react';
import { chairmanMessageData } from '../../../lib/dumyData';
import { colorVariables } from '../../../lib/index';

const ChairmanMessageSection = () => {
  return (
    <div className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-12">
      <h2 className={`text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10`}>
        Chairman's <span className={colorVariables.PRIMARY_COLOR}>Message</span>
      </h2>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-1/3">
          <img
            src={chairmanMessageData.image}
            alt="Chairman - Mascot Projects Private Limited"  
            className="rounded-xl shadow-2xl w-full max-w-sm mx-auto border-4 border-blue-100"
          />
        </div>
        
        <div className="md:w-2/3 space-y-4">
          <MessageSquare className={`w-10 h-10 ${colorVariables.PRIMARY_COLOR} opacity-50`} />
          {chairmanMessageData.messages.map((message, index) => (
            <p key={index} className="text-lg text-gray-700 leading-relaxed">{message}</p>
          ))}
          <div className="pt-4">
            <p className="font-bold text-gray-900 text-xl">- {chairmanMessageData.name}</p>
            <p className={`${colorVariables.PRIMARY_COLOR} font-semibold`}>
              {chairmanMessageData.designation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChairmanMessageSection;