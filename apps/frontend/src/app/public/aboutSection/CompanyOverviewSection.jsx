import React from 'react';
import { Info } from 'lucide-react';
import { dumyImg, companyOverview } from '../../../lib/dumyData';
import { colorVariables } from '../../../lib';
import Button from '../../../components/ui/Button';

const CompanyOverviewSection = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className={`text-4xl md:text-5xl font-extrabold text-gray-900 mb-4`}>
          Our <span className={colorVariables.PRIMARY_COLOR}>Story</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          A trusted RBI-registered NBFC committed to providing accessible and responsible financial solutions since 2015.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 items-start">
        <div className="flex justify-center md:order-2">
          <img
            src={dumyImg.ABOUT_US}
            alt="Mascot Projects Private Limited Office"
            className="rounded-xl shadow-2xl w-full max-w-lg object-cover border-4 border-blue-100"
          />
        </div>

        <div className="md:order-1 text-gray-700 leading-relaxed space-y-6">
          <h3 className={`text-2xl font-bold text-gray-900 flex items-center mb-4`}>
            <Info className={`w-6 h-6 mr-3 ${colorVariables.PRIMARY_COLOR}`} />
            {companyOverview.title}
          </h3>

          {companyOverview.description.map((item, index) => {
            if (item.type === 'highlight') {
              return (
                <p key={index} className="border-l-4 pl-4 border-blue-400" 
                   dangerouslySetInnerHTML={{ __html: item.content }} />
              );
            } else if (item.type === 'commitment') {
              return (
                <div key={index} className={`${colorVariables.LIGHT_BG} p-6 rounded-lg shadow-inner`}>
                  <p className="font-semibold text-gray-800 mb-2">Our Commitment</p>
                  <p className="text-sm text-gray-700">{item.content}</p>
                </div>
              );
            } else {
              return (
                <p key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
              );
            }
          })}

          <p className={`font-semibold ${colorVariables.PRIMARY_COLOR} text-lg`}>
            {companyOverview.closingTagline}
          </p>

          <Button variant="primary" size="md" onClick={() => console.log('Learn more')}>
            Learn More About Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverviewSection;