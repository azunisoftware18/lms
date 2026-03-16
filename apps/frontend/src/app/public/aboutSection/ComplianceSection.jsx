import React from 'react';
import { Shield, Award, CheckCircle, FileText } from 'lucide-react';
import { complianceData } from '../../../lib/dumyData';
import { colorVariables } from '../../../lib';
import Button from '../../../components/ui/Button';

const ComplianceSection = () => {
  return (
    <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
      <h2 className={`text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4`}>
        Compliance & <span className={colorVariables.PRIMARY_COLOR}>Governance</span>
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        {complianceData.subtitle}
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* RBI Registration & Compliance */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">{complianceData.rbiCompliance.title}</h3>
          </div>
          <p className="text-gray-600 mb-4">{complianceData.rbiCompliance.description}</p>
          <ul className="space-y-3">
            {complianceData.rbiCompliance.points.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>{point.text}</strong> {point.subtext}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Corporate Governance */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">{complianceData.corporateGovernance.title}</h3>
          </div>
          <p className="text-gray-600 mb-4">{complianceData.corporateGovernance.description}</p>
          <ul className="space-y-3">
            {complianceData.corporateGovernance.points.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>{point.text}</strong> {point.subtext}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Compliance Highlights */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {complianceData.highlights.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="bg-white/50 backdrop-blur-sm p-4 rounded-lg text-center hover:bg-white/80 transition">
              <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-800">{item.text}</p>
              <p className="text-xs text-gray-500">{item.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Compliance Statement */}
      <div className="mt-8 bg-white/30 backdrop-blur-sm p-6 rounded-lg border border-blue-200">
        <p className="text-gray-700 text-center italic">
          "{complianceData.statement}"
        </p>
      </div>

      {/* Download Button */}
      <div className="mt-8 text-center">
        <Button 
          variant="primary" 
          size="lg" 
          icon={FileText}
          onClick={() => console.log('Download certificate')}
        >
          Download Compliance Certificate
        </Button>
      </div>
    </div>
  );
};

export default ComplianceSection;