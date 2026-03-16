import { Mail, Phone, Clock, MapPin, Flag, Headset, Send, MessageSquare, User, FileText } from 'lucide-react';
import { colorVariables } from '../../lib';
import { dumyImg } from '../../lib/dumyData';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    loanType: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your enquiry. We will get back to you soon!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div
      id="contact"
      className={`font-sans text-gray-800 min-h-screen ${colorVariables.LIGHT_BG}`}>
      <div className="pt-12 px-6">
        <div className="container mx-auto text-center mb-10">
          {/* Main Header Icon: Headset from lucide-react */}
          <Headset
            className={`w-12 h-12 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`}
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Get In <span className={colorVariables.PRIMARY_COLOR}>Touch</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are here to help. Reach out to our offices or the dedicated
            support desk.
          </p>
        </div>
      </div>

      {/* --- */}

      {/* ===== Office Address Section (Using MapPin and Flag) ===== */}
      <section className="container mx-auto px-6 pb-12">
        <h2
          className={`text-3xl font-semibold text-gray-900 mb-6 border-b-4 ${colorVariables.PRIMARY_COLOR} inline-block pb-1`}>
          Registered Office
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Google Map Location */}
          <div className="rounded-xl shadow-2xl overflow-hidden h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.481233526663!2d75.7853246!3d26.8912595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db6f8b1d5c8a5%3A0x3f5c5f5c5f5c5f5c!2sGoyal%20Tower%2C%20Transport%20Nagar%2C%20Jaipur%2C%20Rajasthan%20302003!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mascot Projects Office Location"
              className="w-full h-full"
            ></iframe>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              {/* Flag Icon */}
              <Flag className={colorVariables.PRIMARY_COLOR} />
              <h3 className="text-xl font-bold text-gray-900">
                Mascot Projects <span className="text-gray-600">Private Limited</span>
              </h3>
            </div>

            <div className="space-y-5 text-sm leading-relaxed">
              {/* Registered Office */}
              <div className="border-l-4 border-blue-400 pl-3">
                <h4
                  className={`font-bold text-lg ${colorVariables.PRIMARY_COLOR}`}>
                  Registered Office:
                </h4>
                <p className="flex items-start gap-2 mt-1">
                  {/* MapPin Icon */}
                  <MapPin
                    size={16}
                    className={`mt-1 ${colorVariables.PRIMARY_COLOR} flex-shrink-0`}
                  />
                  <span>302-303, Third Floor, Goyal Tower, Transport Nagar, Jaipur, Rajasthan 302003</span>
                </p>
              </div>

              {/* Contact Details */}
              <div className="pt-2 space-y-3">
                <Link
                  to="tel:8094932111"
                  className="flex items-center gap-2 hover:text-blue-700 transition group">
                  <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition">
                    <Phone className={colorVariables.PRIMARY_COLOR} size={16} />
                  </div>
                  <p className="font-medium text-gray-700">+91 8094932111</p>
                </Link>

                <Link
                  to="mailto:care@mascotfin.in"
                  className="flex items-center gap-2 hover:text-blue-700 transition group">
                  <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition">
                    <Mail className={colorVariables.PRIMARY_COLOR} size={16} />
                  </div>
                  <p className="font-medium text-gray-700">care@mascotfin.in</p>
                </Link>
              </div>

              {/* Operation Hours */}
              <div className="pt-2 flex items-start gap-2">
                <Clock size={16} className={colorVariables.PRIMARY_COLOR} />
                <div>
                  <p className="font-semibold text-gray-900">Office Hours:</p>
                  <p className="text-gray-600">Monday - Saturday: 9:30 AM - 6:30 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Loan Enquiry Form - Done ===== */}
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Loan <span className={colorVariables.PRIMARY_COLOR}>Enquiry</span> Form
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Fill in your details and we'll get back to you within 24 hours
          </p>

          <div className="bg-blue-50 rounded-2xl shadow-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your 10-digit mobile number"
                      pattern="[0-9]{10}"
                      maxLength="10"
                    />
                  </div>
                </div>

                {/* Loan Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Type *
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
                      <option value="personal">Personal Loan</option>
                      <option value="business">Business Loan</option>
                      <option value="home">Home Loan</option>
                      <option value="education">Education Loan</option>
                      <option value="loan-against-property">Loan Against Property</option>
                      <option value="secured-business">Secured Business Loan</option>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Tell us about your loan requirement..."
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className={`${colorVariables.PRIMARY_BUTTON_COLOR} text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition inline-flex items-center gap-2 shadow-lg`}
                >
                  <Send size={20} />
                  Submit Enquiry
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  We respect your privacy. Your information is safe with us.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ===== Support Desk Section (Using Mail, Phone, Clock) ===== */}
      <section className="bg-white py-16 px-6 shadow-inner border-t border-gray-200">
        <div className="container mx-auto">
          <h2
            className={`text-3xl font-semibold text-gray-900 mb-8 border-b-4 ${colorVariables.PRIMARY_COLOR} inline-block pb-1`}>
            Support Desk
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="shadow-lg rounded-lg p-6 flex items-center gap-4 border border-gray-100 bg-blue-50/50 hover:bg-blue-100 transition duration-300">
              <div
                className={`${colorVariables.PRIMARY_BG} text-white p-3 rounded-full shadow-md`}>
                <Mail size={22} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">Customer Service</h4>
                <p className="text-blue-700 font-medium">care@mascotfin.in</p>
              </div>
            </div>

            {/* Phone */}
            <div className="shadow-lg rounded-lg p-6 flex items-center gap-4 border border-gray-100 bg-blue-50/50 hover:bg-blue-100 transition duration-300">
              <div
                className={`${colorVariables.PRIMARY_BG} text-white p-3 rounded-full shadow-md`}>
                <Phone size={22} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">Phone Support</h4>
                <p className="text-blue-700 font-medium">+91 8094932111</p>
              </div>
            </div>

            {/* Hours */}
            <div className="shadow-lg rounded-lg p-6 flex items-center gap-4 border border-gray-100 bg-blue-50/50 hover:bg-blue-100 transition duration-300">
              <div
                className={`${colorVariables.PRIMARY_BG} text-white p-3 rounded-full shadow-md`}>
                <Clock size={22} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">Operation Hours</h4>
                <p className="text-gray-700">9:30 AM to 6:30 PM (Mon-Sat)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Quick Contact Info Bar ===== */}
      <section className={`${colorVariables.PRIMARY_BG} py-4 text-white`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <Phone size={16} /> Toll Free: +91 8094932111
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} /> care@mascotfin.in
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} /> Mon-Sat: 9:30 AM - 6:30 PM
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}