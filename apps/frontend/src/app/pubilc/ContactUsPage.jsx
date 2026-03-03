import { Mail, Phone, Clock, MapPin, Flag, Headset } from "lucide-react";
import { colorVariables } from "../../lib";
import { dumyImg } from "../../lib/dumyData";
import { Link } from "react-router-dom";

export default function ContactUsPage() {

    return (
        <div id='contact' className={`font-sans text-gray-800 min-h-screen ${colorVariables.LIGHT_BG}`}>
            
            <div className="pt-12 px-6">
                <div className="container mx-auto text-center mb-10">
                    {/* Main Header Icon: Headset from lucide-react */}
                    <Headset className={`w-12 h-12 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`} />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                        Get In <span className={colorVariables.PRIMARY_COLOR}>Touch</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We are here to help. Reach out to our offices or the dedicated support desk.
                    </p>
                </div>
            </div>

            {/* --- */}

            {/* ===== Office Address Section (Using MapPin and Flag) ===== */}
            <section className="container mx-auto px-6 pb-12">
                <h2 className={`text-3xl font-semibold text-gray-900 mb-6 border-b-4 ${colorVariables.PRIMARY_COLOR} inline-block pb-1`}>
                     Corporate Office
                </h2>

                <div className="grid md:grid-cols-2 gap-10 items-center">
                    
                    {/* Image Placeholder */}
                    <div className="rounded-xl shadow-2xl overflow-hidden">
                        <img
                            src={dumyImg.LEADERSHIP}
                            alt="Jaipur Office"
                            className="w-full h-80 object-cover"
                        />
                    </div>

                    {/* Address Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            {/* Flag Icon */}
                            <Flag className={colorVariables.PRIMARY_COLOR} />
                            <h3 className="text-xl font-bold text-gray-900">
                                India <span className="text-gray-600">(Jaipur)</span>
                            </h3>
                        </div>

                        <div className="space-y-5 text-sm leading-relaxed">
                            
                            {/* Registered Office */}
                            <div className="border-l-4 border-blue-400 pl-3">
                                <h4 className={`font-bold text-lg ${colorVariables.PRIMARY_COLOR}`}>
                                    Registered Office:
                                </h4>
                                <p className="flex items-start gap-2 mt-1">
                                    {/* MapPin Icon */}
                                    <MapPin size={16} className={`mt-1 ${colorVariables.PRIMARY_COLOR}`} />
                                    702, Seventh Floor, Unique Aspire, Plot No. 13-14 Cosmo Colony,
                                    Amrapali Marg, Vaishali Nagar, Jaipur, Rajasthan–302021
                                </p>
                            </div>

                            {/* Corporate Office */}
                            <div className="border-l-4 border-blue-400 pl-3 pt-2">
                                <h4 className={`font-bold text-lg ${colorVariables.PRIMARY_COLOR}`}>
                                    Corporate Office:
                                </h4>
                                <p className="flex items-start gap-2 mt-1">
                                    {/* MapPin Icon */}
                                    <MapPin size={16} className={`mt-1 ${colorVariables.PRIMARY_COLOR}`} />
                                    Fourth Floor, Unique Aspire, Plot No. 13-14 Cosmo Colony,
                                    Amrapali Marg, Vaishali Nagar, Jaipur, Rajasthan–302021
                                </p>
                            </div>

                            {/* Contact Details */}
                            <div className="pt-2 space-y-3">
                                <Link to="tel:01416699999" className="flex items-center gap-2 hover:text-blue-700 transition">
                                    {/* Phone Icon */}
                                    <Phone className={colorVariables.PRIMARY_COLOR} size={16} />
                                    <p className="font-medium text-gray-700">0141-6699999</p>
                                </Link>

                                <Link to="mailto:info@finova.in" className="flex items-center gap-2 hover:text-blue-700 transition">
                                    {/* Mail Icon */}
                                    <Mail className={colorVariables.PRIMARY_COLOR} size={16} />
                                    <p className="font-medium text-gray-700">info@finova.in</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ===== Support Desk Section (Using Mail, Phone, Clock) ===== */}
            <section className="bg-white py-16 px-6 shadow-inner">
                <div className="container mx-auto">
                    <h2 className={`text-3xl font-semibold text-gray-900 mb-8 border-b-4 ${colorVariables.PRIMARY_COLOR} inline-block pb-1`}>
                         Support Desk
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Email */}
                        <div className="shadow-lg rounded-lg p-6 flex items-center gap-4 border border-gray-100 bg-blue-50/50 hover:bg-blue-100 transition duration-300">
                            <div className={`${PRIMARY_BG_CLASS} text-white p-3 rounded-full shadow-md`}>
                                {/* Mail Icon */}
                                <Mail size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-900">Customer Service</h4>
                                <p className="text-blue-700 font-medium">csd@finova.in</p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="shadow-lg rounded-lg p-6 flex items-center gap-4 border border-gray-100 bg-blue-50/50 hover:bg-blue-100 transition duration-300">
                            <div className={`${PRIMARY_BG_CLASS} text-white p-3 rounded-full shadow-md`}>
                                {/* Phone Icon */}
                                <Phone size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-900">Phone Support</h4>
                                <p className="text-blue-700 font-medium">0141-6699999</p>
                            </div>
                        </div>

                        {/* Operation Hours */}
                        <div className="shadow-lg rounded-lg p-6 flex items-center gap-4 border border-gray-100 bg-blue-50/50 hover:bg-blue-100 transition duration-300">
                            <div className={`${PRIMARY_BG_CLASS} text-white p-3 rounded-full shadow-md`}>
                                {/* Clock Icon */}
                                <Clock size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-900">Operation Hours</h4>
                                <p className="text-gray-700">9:30 AM to 6:30 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}