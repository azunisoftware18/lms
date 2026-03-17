// components/sections/contact/OfficeSection.jsx
import { MapPin, Flag, Phone, Mail, Clock, Globe, ChevronRight } from 'lucide-react';
import { colorVariables } from '../../../lib';
import { contactData } from '../../../lib/dumyData';
import { Link } from 'react-router-dom';

export default function OfficeSection() {
  return (
    <section className="container mx-auto px-6 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <Flag className={`w-6 h-6 ${colorVariables.PRIMARY_COLOR}`} />
        <h2 className="text-3xl font-bold text-gray-900">
          Registered <span className={colorVariables.PRIMARY_COLOR}>Office</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-stretch">
        {/* Google Map Location */}
        <div className="rounded-2xl shadow-2xl overflow-hidden h-96 lg:h-auto">
          <iframe
            src={contactData.office.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mascot Projects Office Location"
            className="w-full h-full min-h-[400px]"
          ></iframe>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Flag className={`w-6 h-6 ${colorVariables.PRIMARY_COLOR}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Mascot Projects <span className="text-gray-600 text-lg">Private Limited</span>
            </h3>
          </div>

          <div className="space-y-6 flex-grow">
            {/* Registered Office */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                <MapPin size={18} /> Registered Office Address
              </h4>
              <p className="text-gray-700 leading-relaxed pl-6">
                {contactData.office.registeredAddress}
              </p>
            </div>

            {/* Contact Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                to={`tel:${contactData.office.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition group"
              >
                <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition">
                  <Phone className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Call Us</p>
                  <p className="font-semibold text-gray-800">{contactData.office.phone}</p>
                </div>
              </Link>

              <Link
                to={`mailto:${contactData.office.email}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition group"
              >
                <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition">
                  <Mail className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Us</p>
                  <p className="font-semibold text-gray-800">{contactData.office.email}</p>
                </div>
              </Link>
            </div>

            {/* Operation Hours */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-start gap-3">
                <Clock size={20} className={colorVariables.PRIMARY_COLOR} />
                <div>
                  <p className="font-bold text-gray-900 mb-2">Office Hours:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Monday - Saturday:</span>
                    <span className="font-medium text-gray-800">{contactData.office.hours.weekdays}</span>
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-medium text-red-600">{contactData.office.hours.sunday}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link 
            to="https://maps.google.com" 
            target="_blank"
            className="mt-6 inline-flex items-center justify-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition"
          >
            <Globe size={18} />
            Get Directions on Google Maps
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}