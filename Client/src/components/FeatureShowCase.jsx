
  
  
import { Link, BarChart2, Layers, Zap } from "lucide-react";
import Marquee from "react-fast-marquee";

const features = [
  {
    icon: Link,
    title: "Custom URL Generation",
    description: "Create memorable, branded short links"
  },
  {
    icon: Layers,
    title: "URL Categorization",
    description: "Organize and manage your links efficiently"
  },
  {
    icon: BarChart2,
    title: "Comprehensive Analytics",
    description: "Gain insights with detailed click statistics"
  },
  {
    icon: Zap,
    title: "Advanced System Tracking",
    description: "Monitor performance across various platforms"
  }
];

export default function FeaturesShowcase() {
  return (
    <section className="py-12 bg-gray-50">
      <h2 className="mb-8 text-2xl font-semibold text-center text-gray-800">Our Powerful Features</h2>
      <Marquee gradient={false} speed={40}>
        <div className="flex">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center mx-8 w-64">
              <feature.icon className="mb-4 h-12 w-12 text-teal-500" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">{feature.title}</h3>
              <p className="text-sm text-center text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
