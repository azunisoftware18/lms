import { colorVariables } from "../../lib";
import { hrValues, galleryImages } from "../../lib/dumyData";

export default function WelcometoFinovaPage() {

  return (
    <div className="font-sans min-h-screen">
      <section className="relative h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlZAk1WKjxi58xH4WgGTjPtOQz-F6ER9xjWA&s')",
            backgroundPosition: 'center',
            opacity: 0.95
          }}
        >
          <div className="absolute inset-0 bg-blue-900 opacity-40"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto h-full flex items-end pb-8 pl-4">
          <h1 className="text-5xl font-extrabold text-white bg-blue-800/80 px-4 py-2 rounded-lg shadow-xl">
            Welcome to <span className="text-yellow-300">Finova</span>
          </h1>
        </div>
      </section>

      <section className={`py-16 px-4 ${colorVariables.LIGHT_BG}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 border-b-4 border-blue-600 inline-block pb-1">
              Creating an <span className={colorVariables.PRIMARY_COLOR}>Inclusive Culture</span>
            </h2>
            <p className="text-gray-600 mt-4">
              At Finova, we believe that a strong organizational culture is the cornerstone of success. Join us, and you'll become part of a dynamic and professional community that values innovation, integrity, and the pursuit of excellence.
            </p>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-lg border-l-4 border-blue-400">
            <div className="text-gray-700 space-y-4 leading-relaxed text-lg">
              <p>
                A career is built over time through hard work, dedication and the right work environment. We, at Finova Capital, believe in further strengthening every employee’s skill to cultivate a strong sense of community and help them achieve their professional and personal aspirations. We have a highly appreciative employee culture. We believe that diverse groups perform better than the homogenous ones. Therefore, we encourage different opinions & ideas and benefit majorly from this collective intelligence to create an inclusive culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
            Our <span className={colorVariables.PRIMARY_COLOR}>HR Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hrValues.map((value, index) => (
              <div key={index} className="flex items-start p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition duration-300">
                <span className={`text-4xl font-extrabold mr-4 ${colorVariables.PRIMARY_COLOR}`}>{value.id}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 px-4 ${colorVariables.LIGHT_BG}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
            Our <span className={colorVariables.PRIMARY_COLOR}>Gallery</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="rounded-xl shadow-xl overflow-hidden group relative transition duration-300 hover:scale-[1.03]">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-72 object-cover transition duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-blue-600/70 text-white translate-y-full group-hover:translate-y-0 transition duration-300">
                  <p className="text-lg font-semibold">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
