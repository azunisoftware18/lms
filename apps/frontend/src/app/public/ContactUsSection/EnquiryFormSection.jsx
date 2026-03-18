// components/sections/contact/EnquiryFormSection.jsx
import { useState } from 'react';
import { Send, User, Mail, Phone, FileText, MessageSquare, CheckCircle, Shield } from 'lucide-react';
import { colorVariables } from '../../../lib';
import { contactData } from '../../../lib/dumyData';
import Button from '../../../components/ui/Button';

export default function EnquiryFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    loanType: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    
    // Show success message
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your enquiry! Our team will get back to you within 24 hours.'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      loanType: '',
      message: ''
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        success: false,
        message: ''
      });
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loan <span className={colorVariables.PRIMARY_COLOR}>Enquiry</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill in your details and our loan experts will get back to you within 24 hours with the best offers tailored to your needs.
          </p>
        </div>

        {/* Success Message */}
        {formStatus.submitted && formStatus.success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <p>{formStatus.message}</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    placeholder="Enter your 10-digit mobile number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                  />
                </div>
              </div>

              {/* Loan Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                  >
                    <option value="">Select Loan Type</option>
                    {contactData.loanTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message / Requirements
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  placeholder="Tell us about your loan requirement (amount, purpose, tenure, etc.)..."
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={<Send size={20} />}
                iconPosition="right"
              >
                Submit Enquiry
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield size={14} className="text-gray-400" />
                <p className="text-xs text-gray-500">
                  We respect your privacy. Your information is encrypted and safe with us.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {contactData.trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className={`w-4 h-4 text-${badge.color}-500`} />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}