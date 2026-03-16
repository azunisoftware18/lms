import { 
  Headset, Mail, Phone, FileText, MessageSquare, FileCheck, 
  Clock, TrendingUp, Shield, Users, Building, ArrowRight, AlertCircle,
  Clock3, ArrowUpCircle, ExternalLink
} from 'lucide-react';
import { grievanceData, companyInfo } from '../../../lib/dumyData';

export default function GrievanceSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headset className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Grievance <span className="text-blue-600">Redressal</span> Mechanism
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {grievanceData.description}
            </p>
          </div>

          {/* Customer Support Channels */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Customer <span className="text-blue-600">Support</span> Channels
            </h3>
            <p className="text-gray-700 text-center mb-8">
              Customers may contact the company for any queries, service requests, or complaints through the following channels:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {grievanceData.supportChannels.map((channel, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
                  <div className={`w-14 h-14 bg-${channel.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <channel.icon className={`w-7 h-7 text-${channel.color}-600`} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{channel.type}</h4>
                  <p className={`text-${channel.color}-600 font-medium`}>{channel.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{channel.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Complaint Resolution Process */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Complaint <span className="text-blue-600">Resolution</span> Process
            </h3>

            <div className="grid md:grid-cols-5 gap-2">
              {grievanceData.processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className={`bg-white border-2 ${step.step === 5 ? 'border-green-200' : 'border-blue-200'} rounded-xl p-4 text-center h-full`}>
                    <div className={`w-10 h-10 ${step.step === 5 ? 'bg-green-600' : 'bg-blue-600'} text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold`}>
                      {step.step}
                    </div>
                    <step.icon className={`w-6 h-6 ${step.step === 5 ? 'text-green-600' : 'text-blue-600'} mx-auto mb-2`} />
                    <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                  {index < 4 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Grievance Redressal Officer Details */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Grievance <span className="text-yellow-300">Redressal Officer</span>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-1">Name of Officer</h4>
                <p className="text-yellow-300 font-bold">{grievanceData.officerDetails.name}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-1">Contact Number</h4>
                <p className="text-yellow-300 font-bold">{grievanceData.officerDetails.phone}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-1">Email Address</h4>
                <p className="text-yellow-300 font-bold">{grievanceData.officerDetails.email}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-1">Office Address</h4>
                <p className="text-yellow-300 font-bold text-sm">{grievanceData.officerDetails.address}</p>
              </div>
            </div>

            <p className="text-center text-blue-200 mt-6 text-sm">
              If your complaint is not resolved satisfactorily, you may approach the Reserve Bank of India Ombudsman Office as per applicable guidelines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}