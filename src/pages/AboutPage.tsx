
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AboutPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-gradient">About DocTalk</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            DocTalk is a comprehensive platform dedicated to women's health education,
            risk assessment, and connecting women with healthcare professionals.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mb-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                At DocTalk, we believe that every woman deserves access to accurate health information
                and quality healthcare. Our mission is to empower women with knowledge about critical health conditions,
                provide tools for early risk assessment, and ensure immediate access to medical guidance when needed.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We focus specifically on breast cancer, PCOD, and PCOS – conditions that affect millions
                of women worldwide but are often detected late or misunderstood. Through education, risk assessment,
                and professional support, we aim to improve early detection and treatment outcomes.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop"
                alt="Healthcare professionals"
                className="rounded-xl shadow-lg max-h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Health Information Tabs */}
        <h2 className="text-2xl font-bold mb-6">Health Conditions We Focus On</h2>
        <Tabs defaultValue="breast-cancer" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breast-cancer">Breast Cancer</TabsTrigger>
            <TabsTrigger value="pcod">PCOD</TabsTrigger>
            <TabsTrigger value="pcos">PCOS</TabsTrigger>
          </TabsList>
          <TabsContent value="breast-cancer" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Breast Cancer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:space-x-6">
                  <div className="md:w-2/3">
                    <h3 className="text-lg font-semibold mb-2">What is Breast Cancer?</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Breast cancer is a disease in which cells in the breast grow out of control. There are different kinds of breast cancer. The kind of breast cancer depends on which cells in the breast turn into cancer.
                    </p>
                    
                    <h3 className="text-lg font-semibold mb-2">Common Symptoms</h3>
                    <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300">
                      <li>New lump in the breast or underarm (armpit)</li>
                      <li>Thickening or swelling of part of the breast</li>
                      <li>Irritation or dimpling of breast skin</li>
                      <li>Redness or flaky skin in the nipple area or the breast</li>
                      <li>Pulling in of the nipple or pain in the nipple area</li>
                      <li>Nipple discharge other than breast milk, including blood</li>
                      <li>Any change in the size or the shape of the breast</li>
                      <li>Pain in any area of the breast</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold mb-2">Risk Factors</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Risk factors include age, genetic mutations, family history, personal history of breast cancer, dense breast tissue, previous radiation therapy, and certain lifestyle factors.
                    </p>
                  </div>
                  <div className="md:w-1/3 mt-4 md:mt-0 flex justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1560699380-6e48f7122509?q=80&w=2070&auto=format&fit=crop"
                      alt="Breast cancer awareness"
                      className="rounded-lg shadow-md max-h-64 object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pcod" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Understanding PCOD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:space-x-6">
                  <div className="md:w-2/3">
                    <h3 className="text-lg font-semibold mb-2">What is PCOD?</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Polycystic Ovary Disease (PCOD) is a medical condition in which the ovaries release immature or partially mature eggs, which eventually turn into cysts. This condition is characterized by enlarged ovaries with small cysts on the outer edges.
                    </p>
                    
                    <h3 className="text-lg font-semibold mb-2">Common Symptoms</h3>
                    <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300">
                      <li>Irregular menstruation</li>
                      <li>Heavy bleeding during periods</li>
                      <li>Hair growth on face and body</li>
                      <li>Weight gain</li>
                      <li>Acne and skin issues</li>
                      <li>Thinning of hair on the scalp</li>
                      <li>Infertility</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold mb-2">Management & Treatment</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      PCOD can be managed through lifestyle changes including healthy diet, regular exercise, and maintaining optimal weight. Medical treatments may include hormone medications, anti-androgen medications, and fertility treatments for those trying to conceive.
                    </p>
                  </div>
                  <div className="md:w-1/3 mt-4 md:mt-0 flex justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1616440347437-b1c73416eef1?q=80&w=2070&auto=format&fit=crop"
                      alt="Women's health"
                      className="rounded-lg shadow-md max-h-64 object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pcos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Understanding PCOS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:space-x-6">
                  <div className="md:w-2/3">
                    <h3 className="text-lg font-semibold mb-2">What is PCOS?</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Polycystic Ovary Syndrome (PCOS) is a hormonal disorder common among women of reproductive age. Women with PCOS may have infrequent or prolonged menstrual periods or excess male hormone (androgen) levels. The ovaries may develop numerous small collections of fluid and fail to release eggs regularly.
                    </p>
                    
                    <h3 className="text-lg font-semibold mb-2">Common Symptoms</h3>
                    <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300">
                      <li>Irregular periods or no periods at all</li>
                      <li>Difficulty getting pregnant (infertility)</li>
                      <li>Excessive hair growth (hirsutism) – usually on the face, chest, back or buttocks</li>
                      <li>Weight gain</li>
                      <li>Thinning hair and hair loss from the head</li>
                      <li>Oily skin or acne</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold mb-2">Diagnosis & Treatment</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      There's no single test for PCOS, but diagnosis involves a medical history, physical exam, blood tests, and sometimes an ultrasound. Treatment focuses on managing your individual concerns, such as infertility, acne, or obesity. Treatments might include lifestyle changes, medication, and surgery.
                    </p>
                  </div>
                  <div className="md:w-1/3 mt-4 md:mt-0 flex justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1584516150909-c43483ee7932?q=80&w=1974&auto=format&fit=crop"
                      alt="Women's healthcare"
                      className="rounded-lg shadow-md max-h-64 object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* App Features */}
        <h2 className="text-2xl font-bold mb-6">Our Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Symptom Assessment Quiz",
              description: "Take our comprehensive quiz to assess your risk levels for breast cancer, PCOD, and PCOS. Get personalized recommendations based on your responses.",
              image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
            },
            {
              title: "24/7 Doctor Connect",
              description: "Connect with healthcare professionals through chat or voice call anytime, anywhere. Get expert advice when you need it most.",
              image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2070&auto=format&fit=crop"
            },
            {
              title: "Emergency SOS System",
              description: "Quick access to emergency services and nearby hospitals with location sharing capabilities for urgent situations.",
              image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=2070&auto=format&fit=crop"
            }
          ].map((feature, index) => (
            <Card key={index} className="overflow-hidden h-full">
              <div className="h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Team Section */}
        <h2 className="text-2xl font-bold mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              name: "Dr. Sarah Johnson",
              role: "Chief Medical Officer",
              image: "https://randomuser.me/api/portraits/women/1.jpg",
              bio: "Gynecologist with 15+ years of experience in women's health."
            },
            {
              name: "Dr. Michael Chen",
              role: "Oncology Specialist",
              image: "https://randomuser.me/api/portraits/men/1.jpg",
              bio: "Specializes in breast cancer research and treatment protocols."
            },
            {
              name: "Emma Rodriguez",
              role: "Patient Advocate",
              image: "https://randomuser.me/api/portraits/women/2.jpg",
              bio: "Former breast cancer survivor dedicated to patient support."
            },
            {
              name: "Dr. Priya Sharma",
              role: "PCOS/PCOD Specialist",
              image: "https://randomuser.me/api/portraits/women/3.jpg", 
              bio: "Leading researcher in hormonal disorders affecting women."
            }
          ].map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-doctalk-purple font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
