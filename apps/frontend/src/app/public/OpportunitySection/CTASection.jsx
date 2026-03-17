// components/sections/opportunity/CTASection.jsx
import Button from "../../../components/ui/Button";

export default function CTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Be Part of India's Growth Story
        </h2>
        <p className="text-blue-100 mb-8 text-lg">
          Join us in empowering MSMEs and driving economic growth through innovative financial solutions.
        </p>
        
        <Button variant="white" size="lg">
          Explore Opportunities
        </Button>
        
        <div className="mt-8 text-sm text-blue-200">
          <p>Mascot Projects Private Limited - RBI Registered NBFC</p>
          <p className="mt-1">Supporting India's MSME sector since establishment</p>
        </div>
      </div>
    </section>
  );
}