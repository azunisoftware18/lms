export default function WelcometoFinovaPage() {

  const PRIMARY_COLOR = "text-blue-600";
  const PRIMARY_BG = "bg-blue-600";
  const LIGHT_BG = "bg-gray-50";
  const ACCENT_BG = "bg-blue-50";

  const hrValues = [
    { id: '01', title: 'Professionalism at its Core', description: 'At Finova, we set high standards for professionalism. Our team is comprised of dedicated individuals who take pride in their work, approach challenges with a solutions-oriented mindset, and uphold the highest ethical standards. We foster an environment where every employee is empowered to contribute their unique skills and expertise to drive the success of our organization.' },
    { id: '02', title: 'Collaborative Excellence', description: 'Success at Finova is a team effort. We believe that collaboration is key to achieving outstanding results. Our teams work seamlessly together, leveraging diverse talents and perspectives to solve complex problems and deliver exceptional financial solutions. As a part of Finova, you\'ll experience a culture that encourages teamwork, values open communication, and fosters a collaborative spirit.' },
    { id: '03', title: 'Continuous Learning and Growth', description: 'At Finova, we are committed to the ongoing development of our employees. We provide ample opportunities for professional growth, offering training programs, mentorship opportunities, and a supportive environment for expanding your skill set. Your success is our priority, and we invest in your development to ensure you reach your full potential.' },
    { id: '04', title: 'A Respectful and Inclusive Workplace', description: 'Respect is at the heart of our culture. We embrace diversity and inclusion, recognizing that a variety of perspectives enriches our work environment. At Finova, you are part of a team where everyone\'s contributions are valued and respected. We foster a culture that promotes equal opportunities, regardless of background or experience.' },
    { id: '05', title: 'Join Finova, Join a Family', description: 'When you join Finova, you become part of a family that cares about your success. We celebrate achievements, support each other in times of challenge, and foster a sense of camaraderie that extends beyond the workplace.' },
  ];

  const galleryImages = [
    { src: "https://www.sosparty.io/imgs/module-grids/91_activities-for-office-christmas-party.jpg", alt: "Team celebrating Christmas" },
    { src: "https://www.sessionlab.com/wp-content/uploads/teambuilding-activities-for-collaboration.jpg", alt: "Team event gathering" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlZAk1WKjxi58xH4WgGTjPtOQz-F6ER9xjWA&s", alt: "Awards ceremony" },
  ];

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

      <section className={`py-16 px-4 ${LIGHT_BG}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 border-b-4 border-blue-600 inline-block pb-1">
              Creating an <span className={PRIMARY_COLOR}>Inclusive Culture</span>
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
            Our <span className={PRIMARY_COLOR}>HR Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hrValues.map((value, index) => (
              <div key={index} className="flex items-start p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition duration-300">
                <span className={`text-4xl font-extrabold mr-4 ${PRIMARY_COLOR}`}>{value.id}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 px-4 ${LIGHT_BG}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
            Our <span className={PRIMARY_COLOR}>Gallery</span>
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
