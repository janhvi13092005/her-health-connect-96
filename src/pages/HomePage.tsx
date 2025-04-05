
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Heart, Activity, MessageSquare, Bell
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Understand Symptoms",
      description: "Learn about symptoms related to breast cancer, PCOD, and PCOS with our detailed information and guidance.",
      icon: Heart,
      color: "text-doctalk-purple",
      bg: "bg-purple-100",
      action: () => navigate("/about")
    },
    {
      title: "Risk Assessment Quiz",
      description: "Take our comprehensive quiz to assess your risk level and get personalized health insights.",
      icon: Activity,
      color: "text-doctalk-teal",
      bg: "bg-blue-100",
      action: () => navigate("/symptom-quiz")
    },
    {
      title: "Connect with Doctors",
      description: "Get 24/7 access to healthcare professionals through chat or voice call for immediate guidance.",
      icon: MessageSquare,
      color: "text-doctalk-pink",
      bg: "bg-pink-100",
      action: () => navigate("/doctor-connect")
    },
    {
      title: "Emergency SOS",
      description: "Quick access to emergency services and nearby hospitals when urgent help is needed.",
      icon: Bell,
      color: "text-red-500",
      bg: "bg-red-100",
      action: () => navigate("/sos")
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-doctalk-lightGray to-white py-20 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="font-gradient">Women's Health</span> <br />
                Simplified & Supported
              </h1>
              <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                DocTalk provides reliable information, risk assessment, and healthcare professional support for women's health concerns including breast cancer, PCOD, and PCOS.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="button-gradient"
                  onClick={() => navigate("/symptom-quiz")}
                >
                  Take Symptom Quiz
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/doctor-connect")}
                >
                  Talk to a Doctor
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
                alt="Doctor consulting with a patient" 
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How DocTalk Helps You</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform is designed to provide comprehensive support for women's health concerns, combining education, risk assessment, and professional medical guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className={`${feature.bg} ${feature.color} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4">{feature.description}</p>
                <Button variant="ghost" className={`${feature.color} flex items-center`} onClick={feature.action}>
                  Learn More 
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-doctalk-lightGray dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories from women who have benefited from DocTalk's services and found support in their health journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                testimonial: "DocTalk helped me understand my PCOS symptoms and connected me with a specialist who finally provided the treatment I needed.",
                image: "https://randomuser.me/api/portraits/women/1.jpg"
              },
              {
                name: "Maya Rodriguez",
                testimonial: "The symptom quiz identified breast cancer risk factors I wasn't aware of. Early detection made all the difference in my recovery.",
                image: "https://randomuser.me/api/portraits/women/2.jpg"
              },
              {
                name: "Priya Sharma",
                testimonial: "Being able to consult with a doctor at 2 AM when I was in pain gave me peace of mind and immediate relief through their guidance.",
                image: "https://randomuser.me/api/portraits/women/3.jpg"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex text-doctalk-purple">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-doctalk-purple to-doctalk-teal rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between">
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to take control of your health?</h2>
                <p className="text-white/80 mb-6 md:mb-0">
                  Our comprehensive approach to women's health helps you understand symptoms, assess risks, and get professional support when you need it most.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/symptom-quiz")}
                  className="bg-white text-doctalk-purple hover:bg-opacity-90 font-semibold px-8 py-4 rounded-md shadow-md"
                >
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
