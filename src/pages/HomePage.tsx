
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Bell } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-gradient">
            Welcome to DocTalk
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your trusted partner for women's health. Get information about breast cancer,
            PCOD, PCOS and connect with specialists 24/7.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="button-gradient">
              <Link to="/doctor-connect">
                <MessageSquare className="mr-2 h-5 w-5" />
                Connect with a Doctor
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/symptom-quiz">
                <Heart className="mr-2 h-5 w-5" />
                Take Symptom Quiz
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-doctalk-purple/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-doctalk-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Symptom Assessment</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Take our comprehensive quiz to understand your symptoms and get personalized recommendations.
                </p>
                <Button asChild variant="link" className="mt-4">
                  <Link to="/symptom-quiz">Start Assessment</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-doctalk-teal/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-doctalk-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Doctor Connect</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Chat or video call with specialists 24/7. Get expert advice from the comfort of your home.
                </p>
                <Button asChild variant="link" className="mt-4">
                  <Link to="/doctor-connect">Connect Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-doctalk-pink/10 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-doctalk-pink" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emergency SOS</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  One-tap emergency assistance. Connect with nearby healthcare providers in critical situations.
                </p>
                <Button asChild variant="link" className="mt-4">
                  <Link to="/sos">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 font-gradient">About DocTalk</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            DocTalk is dedicated to women's health, providing reliable information and
            connecting you with healthcare professionals specialized in breast cancer, PCOD, and PCOS.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/about">Learn More About Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
